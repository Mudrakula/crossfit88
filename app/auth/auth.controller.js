'use strict';

angular.module('crossfit88App')
  .controller('AuthCtrl', function($scope, $cookies, $state, $rootScope, $http) {
    $scope.admin = {};

    $scope.login = admin => {
      $http.post('/api/auth/login', admin)
        .then(res => {
          if (res.status !== 200)
            return console.log(res);

          if (res.data.status !== 'success') {
            admin.password = '';
            admin.error = 'Wrong password or username.';
            return false;
          }

          $rootScope.user = {
            username: admin.username,
            id: admin._id
          };
          $cookies.putObject('user', $rootScope.user);
          return $state.go('users');
        });
    };

    $scope.registration = admin => {
      $http.post('/api/auth/registration', admin)
        .then(res => {
          if (res.status !== 200)
            return console.log(res);

          return $state.go('users');
        });
    };
  })