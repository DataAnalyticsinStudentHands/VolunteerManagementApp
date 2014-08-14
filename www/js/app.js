'use strict';

/* App Module */

var volunteerManagementApp = angular.module('volunteerManagementApp', [
    'ui.router',
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
    'highcharts-ng',
    'adaptive.googlemaps'
]);

volunteerManagementApp.config(function($stateProvider, $urlRouterProvider, $compileProvider, RestangularProvider, $popoverProvider) {
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
      state('login.help', {
          url: ":msg",
          templateUrl: "partials/login.help.html",
          controller: 'lHelpCtrl'
      }).
      state('register', {
          url: "/register",
          views: {
            "app": { templateUrl: "partials/register.html", controller: 'registerCtrl'}
          },
          authenticate: false
      }).
      state('register.help', {
          url: "",
          templateUrl: "partials/register.help.html"
      }).
      state('home.cfeed', {
          url: "/cfeed",
          views: {
            "app": { templateUrl: "partials/communityFeed.html", controller: 'communityFeed'}
          },
          authenticate: true
      }).
      state('home.groupMessages', {
          url: "/groupMessages",
          views: {
            "app-nowrap": { templateUrl: "partials/groupMessages.html", controller: 'groupMessages'}
          },
          authenticate: true
      }).
      state('home.groupMessages.message', {
          url: ":id",
          views: {
            "app-snap-msg": { templateUrl: "partials/groupMessages.message.html", controller: 'message'}},
          authenticate: true
      }).
      state('home.groupFeed', {
          url: "/groupFeed",
          views: {
            "app-nowrap": { templateUrl: "partials/groupFeed.html", controller: 'groupFeed'}
          },
          authenticate: true
      }).
      state('home.groupFeed.detail', {
          url: ":id/:detail",
          views: {
            "post": {templateUrl: "partials/groupFeed.post.html", controller: 'groupFeed.post'},
            "task": {templateUrl: "partials/groupFeed.task.html", controller: 'groupFeed.task'}
          },
          authenticate: true
      }).
      state('home.group', {
          url: "/group:id",
          views: {
            "app": { templateUrl: "partials/efforts.group.html", controller: 'group'}
          },
          authenticate: true
      }).
      state('home.task', {
          url: "/task:task",
          views: {
            "app": { templateUrl: "partials/efforts.task.html", controller: 'task'}
          },
          authenticate: true
      }).
      state('home.efforts', {
          url: "/efforts",
          views: {
            "app": { templateUrl: "partials/efforts.html", controller: 'efforts'}
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
    angular.extend($popoverProvider.defaults, {
        html: true
    });
});

volunteerManagementApp.run(['Restangular', '$rootScope', 'Auth', '$q', '$state', 'vmaUserService', function(Restangular, $rootScope, Auth, $q, $state, vmaUserService) {
//    Restangular.setBaseUrl("http://localhost:8080/VolunteerApp/"); //Just localhost for devices to get to my local server
    Restangular.setBaseUrl("http://www.housuggest.org:8888/VolunteerApp/");
    
    $rootScope.Restangular = function() {
        return Restangular;
    }

    $rootScope.isAuthenticated = function(authenticate) {
        //BELOW - Trying to get promises to work to verify auth
        vmaUserService.getMyUser().then(function(result) {
            console.log("authed");
            result = Restangular.stripRestangular(result)[0];
            $rootScope.uid = result.id.toString();
            $rootScope.uin = result.username.toString();
        }, function(error) {
            if(error.status === 0) {
                console.log("error-0");
            } else {
                Auth.clearCredentials();
                console.log("not-authed");
                if(authenticate) $state.go("login");
            }
        });
        return Auth.hasCredentials();
    }
    
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