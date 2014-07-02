'use strict';

/* App Module */

var volunteerManagementApp = angular.module('volunteerManagementApp', [
  'ngRoute',
  'vmaControllerModule',
  'databaseServicesModule',
  'ui.router',
  'restangular'
]);

volunteerManagementApp.config(
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider.
      state('home', {
          url: "/home",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/communityFeed.html"},
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
      state('communityFeed', {
          url: "/communityFeed",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/communityFeed.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('groupMessages', {
          url: "/groupMessages",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/groupMessages.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('groupFeed', {
          url: "/groupFeed",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/groupFeed.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('efforts', {
          url: "/efforts",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/efforts.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('awards', {
          url: "/awards",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/awards.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('settings', {
          url: "/settings",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/settings.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('calendar', {
          url: "/calendar",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/calendar.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          },
          authenticate: true
      }).
      state('hours', {
          url: "/hours",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/hours.html"},
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