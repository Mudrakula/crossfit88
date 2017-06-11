'use strict';

angular.module('crossfit88App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('users', {
        url: '/',
        templateUrl: 'app/users/users.html',
        controller: 'UsersCtrl',
      });
  });