'use strict';
angular.module('layoutModule').directive('saDragTest', ['$document', function($document) {
    //this version uses jQuery
    //not working down at this level of tree
    return {
        restrict: 'AE',  //restricts to element and attribute only 
        scope: {
            positions: '=' 
        },
        template: '<span>inside template</span><input type="text" value="{{positions}}">',
//        have templates link to types, to load different ones? based on templateURL?
        link: function(scope, element, attr) {      
            var startX = 0, startY = 0, x = 0, y = 0, z = 0, positions = [x,y,z];
            
            element.css({
             position: 'relative',
             border: '1px solid red',
             backgroundColor: 'lightgrey',
             cursor: 'pointer'
            });

            element.on('mousedown', function(event) {
              // Prevent default dragging of selected content
              event.preventDefault();
              startX = event.pageX - x;
              startY = event.pageY - y;
              $document.on('mousemove', mousemove);
              $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
              y = event.pageY - startY;
              x = event.pageX - startX;
              element.css({
                top: y + 'px',
                left:  x + 'px'
              });
              positions = [x,y,z];
                
            }

            function mouseup() {
              $document.off('mousemove', mousemove);
              $document.off('mouseup', mouseup);
                alert(positions);
            }
        }
    };
  }]);
/* Directives */
