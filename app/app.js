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
  .run(function($rootScope, $state, Authentication) {
    $rootScope.$on('$stateChangeStart', (e, toState) => {
      if (toState.allowGuests === true)
        return true;

      let user = Authentication.getUser();
      if (! user) {
        e.preventDefault();
        $state.go('login');
      }

      if (toState.onlyAdmins === true && user.role !== 'admin') {
        e.preventDefault();
        $state.go('logout');
      }

      $rootScope.user = user;
    });
  });