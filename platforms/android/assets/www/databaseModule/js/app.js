'use strict';

/* App Module */

var databaseModule = angular.module('databaseModule', ['ngRoute', 'databaseControllerModule', 'databaseServicesModule']);

databaseModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/db', {
        templateUrl: 'partials/databaseDisplay.html',
        controller: 'dbDisplayController'
      }).
      otherwise({
        redirectTo: '/db'
      });
  }]);