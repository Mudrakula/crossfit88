'use strict';

angular.module('crossfit88App')
  .config(function($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/auth/login.html',
        controller: 'AuthCtrl',
        allowGuests: true,
      })
      .state('registration', {
        url: '/registration',
        templateUrl: 'app/auth/registration.html',
        controller: 'AuthCtrl'
      })
      .state('logout', {
        url: '/logout',
        controller: function($cookies, $state, $rootScope, Authentication) {
          Authentication.logout();
          $rootScope.user = {};
          $state.reload();
        }
      });
  });