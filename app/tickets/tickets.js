'use strict';

angular.module('crossfit88App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tickets', {
        url: '/tickets',
        templateUrl: 'app/tickets/tickets.html',
        controller: 'TicketsCtrl',
        onlyAdmins: true
      });
  });