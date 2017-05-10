'use strict';

angular.module('crossfit88App')
  .controller('AuthCtrl', function($scope, $state, Authentication) {
    $scope.admin = {};

    $scope.login = admin => {
      Authentication.login(admin).then(res => {
        if (res)
          $state.go('users');
      }, err => {
        $scope.admin.error = err;
      });
    };

    $scope.registration = admin => {
      Authentication.registration(admin).then(res => {
        if (res)
          $state.go('users');
      }, err => {
        $scope.admin.error = err;
      });
    };
  });