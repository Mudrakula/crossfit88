'use strict';

angular.module('crossfit88App')
  .controller('TrainersCtrl', function($scope, $http) {
    $scope.trainers = [];
    $scope.currentTrainer = null;

    $scope.getTrainers = () => {
      $http.get('/api/trainers').then(res => {
        $scope.trainers = res.data;
      });
    };

    $scope.deleteTrainer = id => {
      swal({
        title: 'Are you sure?',
        type: 'warning',
        showCancelButton: true
      }, () => {
        $http.post('/api/trainers/delete', {
          id: id
        }).then(res => {
          if (res.status != 200)
            return console.log(res);

          $scope.trainers = _.filter($scope.trainers, trainer => trainer._id != id);
        });
      });
    };

    $scope.showTrainerModal = trainer => {
      $scope.currentTrainer = trainer ? _.clone(trainer) : null;
      angular.element('#trainer-modal').modal();
    };

    $scope.updateTrainer = trainer => {
      $http.post('/api/trainers/update', trainer).then(res => {
        if (res.status != 200)
          return console.log(res);

        if (trainer._id) {
          let index = _.findIndex($scope.trainers, {_id: trainer._id});
          $scope.trainers.splice(index, 1, res.data);
        } else {
          $scope.trainers.push(res.data);
        }

        angular.element('#trainer-modal').modal('hide');
      });
    };

    $scope.getTrainers();
  });