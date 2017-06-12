'use strict';

angular.module('crossfit88App')
  .config(function($stateProvider) {
    $stateProvider
      .state('sales', {
        url: '/sales',
        templateUrl: 'app/sales/sales.html',
        controller: 'SalesCtrl',
        onlyAdmins: true,
        resolve: {
          sales: $http => {
            return $http.get('/api/sales').then(res => {
              return res.data;
            });
          }
        }
      });
  });