'use strict';

angular.module('crossfit88App')
  .controller('UsersCtrl', function($scope, $http) {
    $scope.users = [];
    $scope.currentUser = null;
    $scope.getUsers = () => {
      $http.get('/api/users').then(res => {
        $scope.users = res.data;
        console.log(res.data);
      });
    };

    $scope.deleteUser = id => {
      $http.post('/api/users/delete', {
        id: id
      }).then(res => {
        if (res.status != 200)
          return console.log(res);

        $scope.users = _.filter($scope.users, user => user._id != id);
      });
    };

    $scope.showUserModal = user => {
      $scope.currentUser = user ? _.clone(user) : null;
      angular.element('#user-modal').modal();
    };

    $scope.updateUser = user => {
      $http.post('/api/users/update', user).then(res => {
        if (res.status != 200)
          return console.log(res);

        if (user._id) {
          let index = _.findIndex($scope.users, {_id: user._id});
          $scope.users.splice(index, 1, res.data);
        } else {
          $scope.users.push(res.data);
        }

        angular.element('#user-modal').modal('hide');
      });
    };

    $scope.getUsers();
  });