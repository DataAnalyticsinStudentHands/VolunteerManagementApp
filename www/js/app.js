'use strict';

/* VMA App Module */
angular.module('volunteerManagementApp', [
    'ionic',
    'vmaControllerModule',
    'databaseServicesModule',
    'vmaServicesModule',
    'vmaDirectiveModule',
    'vmaFilterModule',
    'restangular',
    'ngNotify',
    'highcharts-ng',
    'adaptive.googlemaps',
    'ui.bootstrap.datetimepicker'
]).

config(function($stateProvider, $urlRouterProvider, $compileProvider, RestangularProvider) {
    $urlRouterProvider.otherwise("/cfeed");
    $stateProvider.
      state('home', {
          views: {
            "menuBar@home": { templateUrl: "partials/menuBar.html", controller:"menuCtrl"},
            "app": { templateUrl: "partials/home.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html", controller:"menuCtrl"}
          },
          authenticate: true
      }).
      state('login', {
          url: "/login",
          views: {
            "app": {templateUrl: "partials/login.html", controller: 'loginCtrl'}
          },
          authenticate: false
      }).
      state('register', {
          url: "/register",
          views: {
            "app": { templateUrl: "partials/register.html", controller: 'registerCtrl'}
          },
          authenticate: false
      }).
      state('home.cfeed', {
          url: "/cfeed",
          views: {
            "app": { templateUrl: "partials/communityFeed.html", controller: 'postController'}
          },
          authenticate: true
      }).
      state('home.message', {
          url: "/messages/:id",
          views: {
            "app@home": { templateUrl: "partials/groupMessages.message.html", controller: 'message'}
          },
          authenticate: true
      }).
      state('home.groupFeed', {
          url: "/groupFeed",
          views: {
            "app": { templateUrl: "partials/groupFeed.html", controller: 'postController'}
          },
          authenticate: true
      }).
      state('home.myGroups', {
          url: "/myGroups",
          views: {
            "app": { templateUrl: "partials/myGroups.html", controller: 'groupController'}
          },
          authenticate: true
      }).
      state('home.joinGroups', {
          url: "/joinGroups",
          views: {
            "app": { templateUrl: "partials/groups.html", controller: 'groupController'}
          },
          authenticate: true
      }).
      state('home.group', {
          url: "/group/:id",
          views: {
            "app": { templateUrl: "partials/efforts.group.html", controller: 'groupController'}
          },
          authenticate: true
      }).
      state('home.group.posts', {
          url: "/posts",
          views: {
            "app@home": { templateUrl: "partials/groupFeed.post.html", controller: 'postController'}
          },
          authenticate: true
      }).
      state('home.group.posts.comments', {
          url: "/:post_id",
          views: {
            "app@home": { templateUrl: "partials/viewPost.html", controller: 'comments'}
          },
          authenticate: true
      }).
      state('home.group.tasks', {
          url: "/tasks",
          views: {
            "app@home": { templateUrl: "partials/groupFeed.task.html", controller: 'taskController'}
          },
          authenticate: true
      }).
      state('home.task', {
          url: "/task:task",
          views: {
            "app": { templateUrl: "partials/viewTask.html", controller: 'task'}
          },
          authenticate: true
      }).
      state('home.myTasks', {
          url: "/myTasks",
          views: {
            "app": { templateUrl: "partials/myTasks.html", controller: 'taskController'}
          },
          authenticate: true
      }).
      state('home.myInvites', {
          url: "/myInvites",
          views: {
            "app": { templateUrl: "partials/myInvites.html", controller: 'efforts'}
          },
          authenticate: true
      }).
      state('home.awards', {
          url: "/awards",
          views: {
            "app": { templateUrl: "partials/awards.html", controller: 'awards'}
          },
          resolve: {
              tasks: function(vmaHourService) {
                  return vmaHourService.getMyHoursWithTasks(100000, null, null, false);
              }
          },
          authenticate: true
      }).
      state('home.hours_mod', {
          url: "/hours_mod:group_id",
          views: {
            "app": { templateUrl: "partials/hours.moderation.html", controller: "hours.moderation"}
          },
          authenticate: true
      }).
      state('home.settings', {
          url: "/settings",
          views: {
            "app": { templateUrl: "partials/settings.html", controller: "settings"}
          },
          authenticate: true
      }).
      state('home.calendar', {
          url: "/calendar",
          views: {
            "app": { templateUrl: "partials/calendar.html", controller: "calendar"}
          },
          authenticate: true
      }).
      state('home.hours', {
          url: "/hours",
          views: {
            "app": { templateUrl: "partials/hours.html", controller: "hoursController"}
          },
          authenticate: true
      }).
      state('home.hours.myHours', {
          url: "/hours",
          views: {
            "app@home": { templateUrl: "partials/hours.myHours.html", controller: "hoursController"}
          },
          authenticate: true
      }).
      state('home.userPicture', {
          url: "/userPicture",
          views: {
            "app@home": { templateUrl: "partials/userPicture.html", controller: "userPicture"}
          },
          authenticate: true
      });
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|geo|maps):/);

    //RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
    //    console.log(data, operation, what, url, response, deferred);
    //    return data;
    //});
    //
    //RestangularProvider.setErrorInterceptor(function(response, deferred, responseHandler) {
    //    //if(response.status === 403) {
    //    //    refreshAccesstoken().then(function() {
    //    //        // Repeat the request and then call the handlers the usual way.
    //    //        $http(response.config).then(responseHandler, deferred.reject);
    //    //        // Be aware that no request interceptors are called this way.
    //    //    });
    //    //
    //    //    return false; // error handled
    //    //}
    //    console.log(response);
    //    return true; // error not handled
    //});
}).

constant('$ionicLoadingConfig', {
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
}).

run(['Restangular', '$rootScope', 'Auth', '$q', '$state', 'vmaUserService', 'ngNotify', function(Restangular, $rootScope, Auth, $q, $state, vmaUserService, ngNotify) {
    //Restangular.setBaseUrl("http://localhost:8080/VolunteerApp/");            //THE LOCAL HOST
//    Restangular.setBaseUrl("http://172.27.219.120:8080/VolunteerApp/");       //THE MAC AT CARL'S DESK
    Restangular.setBaseUrl("https://www.housuggest.org:8443/VolunteerApp/");     //HOUSUGGEST FOR VMA CORE

    //TO ACCESS RESTANGULAR IN CONTROLLERS WITHOUT INJECTION
    $rootScope.Restangular = function() {
        return Restangular;
    };

    //CHECKING IF AUTHENTICATED ON STATE CHANGE - Called in $stateChangeStart
    $rootScope.isAuthenticated = function(authenticate) {
        if(!$rootScope.uid) {
            vmaUserService.getMyUser().then(function (result) {
                console.log("authed");
                result = Restangular.stripRestangular(result)[0];
                //USERNAME & ID TO BE USED IN CONTROLLERS
                $rootScope.uid = result.id.toString();
                $rootScope.uin = result.username.toString();
            });
        }
        vmaUserService.getMyRole().then(function(success){
                $rootScope.role = success;
                $rootScope.isMod = (success == "ROLE_MODERATOR");
                $rootScope.isAdm = (success == "ROLE_ADMIN");
        }, function (error) {
            if (error.status === 0) { // NO NETWORK CONNECTION OR SERVER DOWN, WE WILL NOT LOG THEM OUT
                ngNotify.set("Internet or Server Unavailable", {type: "error", sticky: true});
            } else { //Most Likely a 403 - LOG THEM OUT
                Auth.clearCredentials();
                console.log("not-authed");
                if (authenticate) {
                    $state.go("login");
                    location.reload();
                }
            }
        });
        return Auth.hasCredentials();
    };

    $rootScope.badgeConfig = [
        "Badge 1",
        "Badge 2",
        "Badge 3",
        "Badge 4",
        "General"
    ];

    //AUTHENTICATE ON CHANGE STATE
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        console.log("$stateChangeStart");
        if (toState.authenticate && !$rootScope.isAuthenticated(toState.authenticate)){
            console.log("non-authed");
            // User isn’t authenticated
            $state.go("login");
            //Prevents the switching of the state
            event.preventDefault();
        }
    });
}]);
