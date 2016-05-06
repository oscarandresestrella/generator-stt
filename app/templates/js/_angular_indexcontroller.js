define([], function() {
	'use strict';

	function indexController($scope, $http,$timeout) {
    $scope.timeInMs = 0;
    console.log('Controller ===  indexController');

	}
	indexController.$inject = ['$scope', '$http','$timeout'];
	return indexController;
});
