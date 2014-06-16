'use strict';

/* jshint indent: false */
describe('Controller: IndexController', function () {

    // load the controller's module
    beforeEach(module('volunteerManagementApp'));

    var IndexController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        IndexController = $controller('IndexController', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});
