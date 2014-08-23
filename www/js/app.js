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
    'mgcrea.ngStrap.datepicker',
    'mgcrea.ngStrap.timepicker',
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
            "app-snap-msg": { templateUrl: "partials/groupMessages.message.html", controller: 'message'}
          },
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
      state('home.groupFeed.detail.right_pane_task', {
          url: "/task/:task",
          views: {
            "right_pane@home.groupFeed": {templateUrl: "partials/viewTask.html", controller: 'home.groupFeed.detail.right_pane_task'}
          },
          authenticate: true
      }).
      state('home.groupFeed.detail.right_pane_post', {
          url: "/post/:post_id",
          views: {
            "right_pane@home.groupFeed": {templateUrl: "partials/viewPost.html", controller: 'home.groupFeed.detail.right_pane_post'}
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
    angular.extend($popoverProvider.defaults, { html: true });
});

volunteerManagementApp.run(['Restangular', '$rootScope', 'Auth', '$q', '$state', 'vmaUserService', function(Restangular, $rootScope, Auth, $q, $state, vmaUserService) {
    //Just localhost for devices to get to local server
    Restangular.setBaseUrl("http://localhost:8080/VolunteerApp/");
    //Just localhost at UH for Carl's Laptop's local tomcat server
    //Restangular.setBaseUrl("http://172.25.240.82:8080/VolunteerApp/");
//    Restangular.setBaseUrl("http://www.housuggest.org:8888/VolunteerApp/");
    
    //TO ACCESS RESTANGULAR IN CONTROLLARS WITHOUT INJECTION
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
            if(error.status === 0) { // NO NETWORK CONNECTION
                console.log("error-0");
            } else {
                Auth.clearCredentials();
                console.log("not-authed");
                if(authenticate) $state.go("login");
            }
        });
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