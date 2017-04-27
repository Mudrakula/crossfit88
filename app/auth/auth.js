'use strict';

angular.module('crossfit88App')
  .config(function($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/auth/login.html',
        controller: 'AuthCtrl'
      })
      .state('registration', {
        url: '/registration',
        templateUrl: 'app/auth/registration.html',
        controller: 'AuthCtrl'
      });
  });