'use strict';

angular.module('crossfit88App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admins', {
        url: '/admins',
        templateUrl: 'app/admins/admins.html',
        controller: 'AdminsCtrl',
        onlyAdmins: true
      });
  });