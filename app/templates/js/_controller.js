/*================================================================
Controller = <%= classedName %>Ctrl
==================================================================*/
define([], function() {
	'use strict';

	function '<%= classedName %>Controller'($scope, $http,$timeout) {
    $scope.timeInMs = 0;
    console.log('Controller ===  <%= classedName %>Ctrl');

	}
	'<%= classedName %>Controller'.$inject = ['$scope', '$http','$timeout'];
	return '<%= classedName %>Controller';
});
/*-----  End of Controller = <%= classedName %>Ctrl  ------*/
