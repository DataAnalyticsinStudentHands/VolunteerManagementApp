'use strict';

/* App Module */
//Why is there both a routecontroller and a statecontroller one directory level higher?

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