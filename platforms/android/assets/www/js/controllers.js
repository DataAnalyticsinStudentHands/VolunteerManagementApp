'use strict';

/* Controllers */

var vmaControllerModule = angular.module('vmaControllerModule', []);
var positions = 'tere';
//var testData = {'1','2'};
//var testData = { layoutObjects : {objectType: 'extline,etc.'},
//                        {objPositions: {startPos: {x:'110',y:'220'},endPos: {x:'330',y:'440'},curvePos: {x:'550',y:'300'}}},
//                        {color: 'blue'},
//                        {order: 'if need load order'}
//                        },
//                        { questions : 
//                            {questionMeta:
//                                {questionVersion: '.01',questionStyles: 'changable'}},
//                            {questionObjects:
//                                {questionId: 'only thing that normally passes'}
//                                {questionType: 'check, radio, etc.'},
//                                {questionTheme: 'hazard, etc.'},
//                                {questionOrder: 'number within theme'},
//                                {questionText: ''},
//                                {answerValue: ''}
//                            }
//                        };

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
             $state.go('login.help', {msg: $scope.message}, {location: false});
         } else if (!$scope.userName) {
             $scope.loginMsg = "Please enter your username!";
             $scope.loginResult = "";
         } else if (!$scope.passWord) {
             $scope.loginMsg = "Please enter your password!";
             $scope.loginResult = "";
         }
         };
     

                 //need this to not put databaseConnection here, but have the datamodel for layout here
        
                                                        
        $scope.data = $scope.hello(testData);
                                                        
        $scope.alert = function(text){
            alert(text);
        };
//        
//        $scope.alertPosition = function(positions){
//            alert('position:' + positions);
//        };
//                                                        
//        $scope.recordPositions = function(positions){
//            $scope.hello(positions); //should just be an echo
//        };
     
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

  