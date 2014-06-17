'use strict';

/* Controllers */

var vmaControllerModule = angular.module('vmaControllerModule', []);

vmaControllerModule.controller('loginCtrl', ['$scope', 'databaseConnection', '$state', '$routeParams', 
  function($scope, databaseConnection, $state, $routeParams) {
    $scope.submit = function() {
        if ($scope.userName && $scope.passWord) {
            $scope.loginMsg = "Thank you for logging in!";
            $scope.loginResult = databaseConnection.login({userName:$scope.userName, passWord:$scope.passWord});
            $scope.userName = '';
            $scope.passWord = '';
        } else if(!$scope.userName && !$scope.passWord) {
        //Opening up a nested state with a parameter! Alos, this is done from an out side state, so this covers both topics: 1) Open a state from outside state (not itself). 2) Pass and display parameters.
            //NOTE: This only appears if you don't enter your password AND username
            $scope.message = "You haven't entered your username OR password!";
            $state.go('login.help', {msg: $scope.message});
        } else if (!$scope.userName) {
            $scope.loginMsg = "Please enter your username!";
            $scope.loginResult = "";
        } else if (!$scope.passWord) {
            $scope.loginMsg = "Please enter your password!";
            $scope.loginResult = "";
        }
    };
  }]);

vmaControllerModule.controller('menuCtrl', ['$scope', '$state',
  function($scope, $state) {
    $scope.goBack = function() {
        window.history.back();
    };
  }]);

vmaControllerModule.controller('lHelpCtrl', ['$scope', '$state', '$stateParams',
  function($scope, $state, $stateParams) {
    $scope.msg = $stateParams.msg;
  }]);