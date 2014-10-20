'use strict';

/* Filters */
var vmaFilterModule = angular.module('vmaFilterModule', []);


vmaFilterModule.filter('getById', function() {
    return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (+input[i].id == +id) {
        return input[i];
      }
    }
    return null;
  }
});

vmaFilterModule.filter('getTasksByGroupId', function() {
    return function(input, id) {
    var returnArray = [];
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (+input[i].group_id == +id) {
        returnArray.push(input[i]);
      }
    }
    return returnArray;
  }
});

vmaFilterModule.filter('getByGroupId', function() {
    return function(input, id) {
    var returnArray = [];
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (+input[i].group_id == +id) {
        returnArray.push(input[i]);
      }
    }
    return returnArray;
  }
});

vmaFilterModule.filter('removeJoined', function() {
    return function(input, id) {
    var returnArray = [];
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (!input[i].joined) {
        returnArray.push(input[i]);
      }
    }
    return returnArray;
  }
});