'use strict';

/* Directives */
var vmaDirectiveModule = angular.module('vmaDirectiveModule', []);

vmaDirectiveModule.directive('stopEvent', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.on(attr.stopEvent, function (e) {
          e.stopPropagation();
        });
      }
    };
  });