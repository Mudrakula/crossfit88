'use strict';

angular.module('crossfit88App', [
  // 'ngCookies',
  // 'ngResource',
  // 'ngSanitize',
  'ui.router'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });