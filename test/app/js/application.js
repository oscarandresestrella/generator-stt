/*================================================================
App test
==================================================================*/
'use strict';
require.config({
  paths: {
    routes: './routes',
    text: '../lib/text',
    angular: '../lib/angular',
    jquery: '../lib/jquery',
    bootstrap: '../lib/bootstrap',
    angularcontentful: '../lib/angular-contentful',
    angularsanitize: '../lib/angular-sanitize',
    underscore:'../lib/underscore',
    angularbreadcrumb: '../lib/angular-breadcrumb',
    angularuirouter: '../lib/angular-ui-router'
  },
  shim: {
    'underscore': {
      exports: '_'
    },
    'angularuirouter': {'deps': ['angular']},
    'angularbreadcrumb': {'deps': ['angular']}
  }
});


require(['angular', 'jquery'], function() {
  require(['bootstrap','angularsanitize','underscore','angularuirouter','angularbreadcrumb'], function() {
    window.app = {};
    window.app = angular.module('test', ['ui.router','ncy-angular-breadcrumb']);
    require(['js/controllers/index'], function (indexController) {
      window.app.controller('indexController', indexController);
      window.app.config(['$stateProvider','$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
          .state('index', {
            url:'/',
            templateUrl: '/templates/index.html',
            controller: 'indexController',
            ncyBreadcrumb: {
              label: 'index'
            }
          }).
          state('vista2', {
            url:'/vista2',
            templateUrl: '/templates/vista2.html',
            controller: 'indexController',
            ncyBreadcrumb: {
              label: 'vista1'
            }
          });

      }]);
      angular.bootstrap(document.getElementById('test'), ['test']);
    });
  });
});
