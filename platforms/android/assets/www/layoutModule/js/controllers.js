'use strict';
/* Controllers */
var layoutController = angular.module('layoutControllerModule', []);
layoutController.controller('layoutDisplayController', ['$scope', 
    function($scope) {
        //need this to not put databaseConnection here, but have the datamodel for layout here
//        var testData = { layoutObjects : {objectType: 'extline,etc.'},
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
//                                                        
//        $scope.data = $scope.hello(testData);
//                                                        
//        $scope.alert(text) = function(){
//            alert(text);
//        };
//        
//        $scope.alertPosition = function(positions){
//            alert('position:' + positions);
//        };
//                                                        
//        $scope.recordPositions = function(positions){
//            $scope.hello(positions); //should just be an echo
//        };
     }]);   
        
        
        
//var databaseController = angular.module('databaseControllerModule', []);
//databaseController.controller('dbDisplayController', ['$scope', 'databaseConnection',
//  function($scope, databaseConnection) {
//    $scope.hello = databaseConnection.hello(); //result to hello method, technically same as query
//    $scope.queryResult = databaseConnection.query(); //result to query
//      
//    //Using the login() function without callback
//    //$scope.login = databaseConnection.login({"data": {"userName":"user", "passWord": "pass"}});
//    
//    databaseConnection.login({"data": {userName:"user", passWord: "pass"}}, function(value){
//        //This is a call back function for the login() action on the resource object
//        //console.log(value);
//        $scope.login = value;
//        $scope.loginData = JSON.parse(value.data);
//    });
//  }]);