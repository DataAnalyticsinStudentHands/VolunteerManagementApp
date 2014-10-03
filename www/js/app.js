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
    'ngTouch',
    'ngNotify',
    'headroom',
    'snap',
    'ui.bootstrap.tpls',
    'ui.bootstrap.carousel',
    'ui.bootstrap.tabs',
    'ui.bootstrap.modal',
    'ui.bootstrap.dropdown',
    'ui.bootstrap.datepicker',
    'ui.bootstrap.timepicker',
    'mgcrea.ngStrap.tooltip',
    'mgcrea.ngStrap.popover',
    'mgcrea.ngStrap.datepicker',
    'mgcrea.ngStrap.timepicker',
    'highcharts-ng',
    'adaptive.googlemaps'
]).

config(function($stateProvider, $urlRouterProvider, $compileProvider, RestangularProvider, $popoverProvider) {
    $urlRouterProvider.otherwise("/cfeed");
    $stateProvider.
      state('home', {
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html", controller:"menuCtrl"},
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
      state('home.groupMessages', {
          url: "/groupMessages",
          views: {
            "app@home": { templateUrl: "partials/groupMessages.html", controller: 'taskController'}
          },
          authenticate: true
      }).
      state('home.groupMessages.message', {
          url: ":id",
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
            "app@home": { templateUrl: "partials/viewPost.html", controller: 'home.groupFeed.detail.right_pane_post'}
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
          authenticate: true
      }).
      state('home.hours_mod', {
          url: "/hours_mod",
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
            "app": { templateUrl: "partials/hours.html", controller: "hours"}
          },
          authenticate: false
      });    
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|geo|maps):/);
    angular.extend($popoverProvider.defaults, { html: true });
}).

run(['Restangular', '$rootScope', 'Auth', '$q', '$state', 'vmaUserService', 'ngNotify', function(Restangular, $rootScope, Auth, $q, $state, vmaUserService, ngNotify) {
//    Restangular.setBaseUrl("http://localhost:8080/VolunteerApp/"); //THE LOCAL HOST
//    Restangular.setBaseUrl("http://172.27.219.120:8080/VolunteerApp/"); //THE MAC AT CARL'S DESK
//    Restangular.setBaseUrl("http://172.25.80.82:8080/VolunteerApp/"); //CARL'S LAPTOP
    Restangular.setBaseUrl("http://www.housuggest.org:8888/VolunteerApp/"); //HOUSUGGEST FOR VMA CORE
        
    //TO ACCESS RESTANGULAR IN CONTROLLERS WITHOUT INJECTION
    $rootScope.Restangular = function() {
        return Restangular;
    }
    
    //CHECKING IF AUTHENTICATED ON STATE CHANGE - Called in $stateChangeStart
    $rootScope.isAuthenticated = function(authenticate) {
        //BELOW - Trying to get promises to work to verify auth
        vmaUserService.getMyUser().then(function(result) {
            console.log("authed");
            result = Restangular.stripRestangular(result)[0];
            //USERNAME & ID TO BE USED IN CONTROLLERS
            $rootScope.uid = result.id.toString();
            $rootScope.uin = result.username.toString();
        }, function(error) {
            if(error.status === 0) { // NO NETWORK CONNECTION OR SERVER DOWN, WE WILL NOT LOG THEM OUT
//                console.log("error-0");
//                Restangular.allUrl('CHECKSITE', 'http://google.com').getList().then(
//                    function(success) {
//                        ngNotify.set("SERVER IS DOWN", {type : "error", sticky : true});
//                    },
//                    function(fail) {
//                        ngNotify.set("NO INTERNET CONNECTION", {type : "error", sticky : true});
//                    }
//                );
                ngNotify.set("Internet or Server Unavailable", {type : "error", sticky : true});
            } else { // LOG THEM OUT
                Auth.clearCredentials();
                console.log("not-authed");
                if(authenticate) $state.go("login");
            }
        });
        
        vmaUserService.getMyRole().then(
            function(success){
                $rootScope.role = success;
                $rootScope.isMod = (success == "ROLE_MODERATOR");
            }
        );
        return Auth.hasCredentials();
    }
    
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