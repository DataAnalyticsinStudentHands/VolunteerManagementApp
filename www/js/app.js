'use strict';

/* App Module */

var volunteerManagementApp = angular.module('volunteerManagementApp', [
  'ngRoute',
  'vmaControllerModule',
  'databaseServicesModule',
  'ui.router'
]);

volunteerManagementApp.config(
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/login");

    $stateProvider.
      state('home', {
          url: "/home",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/communityFeed.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          }
      }).
      state('login', {
          url: "/login",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": {templateUrl: "partials/login.html", controller: 'loginCtrl'},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
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
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/register.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
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
          }
      }).
      state('groupMessages', {
          url: "/groupMessages",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/groupMessages.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          }
      }).
      state('groupFeed', {
          url: "/groupFeed",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/groupFeed.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          }
      }).
      state('efforts', {
          url: "/efforts",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/efforts.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          }
      }).
      state('awards', {
          url: "/awards",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/awards.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          }
      }).
      state('settings', {
          url: "/settings",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/settings.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          }
      }).
      state('calendar', {
          url: "/calendar",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/calendar.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          }
      }).
      state('hours', {
          url: "/hours",
          views: {
            "menuBar": { templateUrl: "partials/menuBar.html"},
            "app": { templateUrl: "partials/hours.html"},
            "bottomMenu":  { templateUrl: "partials/bottomMenu.html"}
          }
      });
  });