'use strict';

/* Controllers */

var vmaControllerModule = angular.module('vmaControllerModule', []);

vmaControllerModule.controller('loginCtrl', ['$scope', 'databaseConnection', '$routeParams', 
  function($scope, databaseConnection, $routeParams) {
    $scope.submit = function() {
        if ($scope.userName && $scope.passWord) {
            $scope.loginMsg = "Thank you for logging in!";
            $scope.loginResult = databaseConnection.login({userName:$scope.userName, passWord:$scope.passWord});
            $scope.userName = '';
            $scope.passWord = '';
        } else if (!$scope.userName) {
            $scope.loginMsg = "Please enter your username!";
            $scope.loginResult = "";
        } else if (!$scope.passWord) {
            $scope.loginMsg = "Please enter your password!";
            $scope.loginResult = "";
        }
    };
  }]);

vmaControllerModule.controller('menuCtrl', ['$scope',
  function($scope) {
    $scope.goBack = function() {
        window.history.back();
    };
  }]);