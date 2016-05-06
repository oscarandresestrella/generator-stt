/*================================================================
Directive = <%= cameledName %>
==================================================================*/
define([], function() {
	'use strict';

	function <%= cameledName %>Directive() {
		return {
			restrict: 'E',
			controller: '',
			template: 'template'
		};
	}
	return <%= cameledName %>Directive;
});
