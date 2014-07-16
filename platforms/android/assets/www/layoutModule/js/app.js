'use strict';

/* App Module */

var layoutModule = angular.module('layoutModule', ['ngRoute', 'layoutControllerModule']);

layoutModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/layout', {
        templateUrl: '../partials/layoutDisplay.html',
        controller: 'layoutDisplayController'
      }).
      otherwise({
        redirectTo: '/layout'
      });
  }]);