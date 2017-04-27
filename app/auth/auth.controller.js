'use strict';

angular.module('crossfit88App')
  .controller('AuthCtrl', function($scope, $http) {
    $scope.admin = {};

    $scope.login = admin => {
      $http.post('/api/login', admin)
        .then(res => {
          if (res.status !== 200)
            return console.log(res);

          console.log(res);
        });
    };

    $scope.registration = admin => {
      $http.post('/api/registration', admin)
        .then(res => {
          if (res.status !== 200)
            return console.log(res);

          console.log(res);
        });
    };
  })