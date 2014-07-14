'use strict';

/* App Module */

var volunteerManagementApp = angular.module('volunteerManagementApp', [
  'ngRoute',
  'vmaControllerModule',
  'databaseServicesModule',
  'ngTouch',
  'ui.router',
  'ui.bootstrap',
  'restangular',
  'snap'
]);

volunteerManagementApp.config(
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider.
      state('home', {
          url: "/home",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/home.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('login', {
          url: "/login",
          views: {
            "app": {templateUrl: "partials/login.html", controller: 'loginCtrl'}
          }
      }).
      state('login.help', {
          url: ":msg",
          templateUrl: "partials/login.help.html",
          controller: 'lHelpCtrl'
      }).
      state('register', {
          url: "/register",
          views: {
            "app": { templateUrl: "partials/register.html"}
          }
      }).
      state('register.help', {
          url: "",
          templateUrl: "partials/register.help.html"
      }).
      state('home.cfeed', {
          url: "/cfeed",
          views: {
            "app": { templateUrl: "partials/communityFeed.html", controller: 'communityFeedController'}
          },
          authenticate: true
      }).
      state('home.groupMessages', {
          url: "/groupMessages",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/groupMessages.html", controller: 'groupMessages'},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('home.message', {
          url: "/message:id",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/groupMessages.message.html", controller: 'message'},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('home.groupFeed', {
          url: "/groupFeed",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/groupFeed.html", controller: 'groupFeed'},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('groupFeed.post', {
          url: "/groupFeed/post:id",
          views: {
            "post": {templateUrl: "partials/groupFeed.post.html", controller: 'groupFeed.post'}
          },
          authenticate: true
      }).
      state('home.group', {
          url: "/group:id",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/efforts.group.html", controller: 'group'},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('home.task', {
          url: "/task:id",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/efforts.task.html", controller: 'task'},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('home.efforts', {
          url: "/efforts",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/efforts.html", controller: 'efforts'},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('home.awards', {
          url: "/awards",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/awards.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('home.settings', {
          url: "/settings",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/settings.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('home.calendar', {
          url: "/calendar",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/calendar.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('home.hours', {
          url: "/hours",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/hours.html", controller: 'hours'},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      });
  });

volunteerManagementApp.run(['Restangular', '$rootScope', 'Auth', '$q', '$state', function(Restangular, $rootScope, Auth, $q, $state) {
    Restangular.setBaseUrl("http://localhost:8080/RESTFUL-WS/services/");
    $rootScope.Restangular = function() {
        return Restangular;
    }
    $rootScope.addAuth = function() {
        //
    }
    $rootScope.isAuthenticated = function() {
        //BELOW - Trying to get promises to work to verify auth
//        var deferred = $q.defer();
//        //This should be set to a work-all URL.
//        var rqPromise = Restangular.all("users").get("2").then(function(result) {
//            console.log("authed");
//            return true;
//        }, function(error) {
//            Auth.clearCredentials();
//            console.log("not-authed");
//            return false;
//        });
//        return deferred.resolve(rqPromise);
        //END
//        return Auth.hasCredentials();
        return true;
    }
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      console.log("$stateChangeStart");
      console.log($rootScope.isAuthenticated());
      if (toState.authenticate && !$rootScope.isAuthenticated()){
        console.log("non-authed");
        // User isn’t authenticated
        $state.go("login");
        //What?
        event.preventDefault(); 
      } else console.log("authed");
    });
}]);