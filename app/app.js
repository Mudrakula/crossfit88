'use strict';

angular.module('crossfit88App', [
  'ngCookies',
  // 'ngResource',
  // 'ngSanitize',
  'ui.router'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  })
  .run(function($rootScope, $state, $cookies, Authentication) {
    $rootScope.$on('$stateChangeStart', (e, toState) => {
      if (toState.allowGuests === true)
        return true;

      let user = $cookies.getObject('user');
      $rootScope.user = user;
      if (! user) {
        e.preventDefault();
        $state.go('login');
      }

      Authentication.user = user;
    });
  });