'use strict';

/* App Module */

var volunteerManagementApp = angular.module('volunteerManagementApp', [
  'ngRoute',
  'vmaControllerModule',
  'databaseServicesModule',
  'ui.router',
  'ui.bootstrap',
  'restangular',
  'snap'
]);

volunteerManagementApp.config(
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/cfeed");

    $stateProvider.
      state('home', {
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
            "app": { templateUrl: "partials/groupMessages.html", controller: 'groupMessages'}
          },
          authenticate: true
      }).
      state('home.message', {
          url: "/message:id",
          views: {
            "app": { templateUrl: "partials/groupMessages.message.html", controller: 'message'}},
          authenticate: true
      }).
      state('home.groupFeed', {
          url: "/groupFeed",
          views: {
            "app": { templateUrl: "partials/groupFeed.html", controller: 'groupFeed'},
          },
          authenticate: true
      }).
      state('home.groupFeed.post', {
          url: "/post:id",
          views: {
            "post": {templateUrl: "partials/groupFeed.post.html", controller: 'groupFeed.post'}
          },
          authenticate: true
      }).
      state('home.group', {
          url: "/group:id",
          views: {
            "app": { templateUrl: "partials/efforts.group.html", controller: 'group'},
          },
          authenticate: true
      }).
      state('home.task', {
          url: "/task:id",
          views: {
            "app": { templateUrl: "partials/efforts.task.html", controller: 'task'},
          },
          authenticate: true
      }).
      state('home.efforts', {
          url: "/efforts",
          views: {
            "app": { templateUrl: "partials/efforts.html", controller: 'efforts'},
          },
          authenticate: true
      }).
      state('home.awards', {
          url: "/awards",
          views: {
            "app": { templateUrl: "partials/awards.html"},
          },
          authenticate: true
      }).
      state('home.settings', {
          url: "/settings",
          views: {
            "app": { templateUrl: "partials/settings.html"},
          },
          authenticate: true
      }).
      state('home.calendar', {
          url: "/calendar",
          views: {
            "app": { templateUrl: "partials/calendar.html"},
          },
          authenticate: true
      }).
      state('home.hours', {
          url: "/hours",
          views: {
            "app": { templateUrl: "partials/hours.html"},
          },
          authenticate: false
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