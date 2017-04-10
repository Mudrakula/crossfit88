'use strict';

angular.module('crossfit88App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('trainers', {
        url: '/trainers',
        templateUrl: 'app/trainers/trainers.html',
        controller: 'TrainersCtrl'
      });
  });