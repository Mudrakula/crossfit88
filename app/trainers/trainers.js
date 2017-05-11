'use strict';

angular.module('crossfit88App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('trainers', {
        url: '/trainers',
        templateUrl: 'app/trainers/trainers.html',
        controller: 'TrainersCtrl',
        resolve: {
          trainers: $http => {
            return $http.get('/api/trainers').then(res => {
              return res.data;
            });
          }
        }
      })
      .state('trainers.trainer', {
        url: '/{id}',
        views: {
          '@': {
            templateUrl: 'app/trainers/trainer.html',
            controller: 'TrainerCtrl',
          }
        },
        resolve: {
          trainer: (trainers, $stateParams) => {
            return _.find(trainers, {_id: $stateParams.id});
          }
        }
      });
  });