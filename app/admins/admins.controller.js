'use strict';

angular.module('crossfit88App')
  .controller('AdminsCtrl', function($scope, $http) {
    $scope.admins = [];
    $scope.currentAdmin = null;

    $scope.getAdmins = () => {
      $http.get('/api/auth').then(res => {
        $scope.admins = res.data;
      });
    };

    $scope.deleteAdmin = id => {
      swal({
        title: 'Are you sure?',
        type: 'warning',
        showCancelButton: true
      }, () => {
        $http.delete('/api/auth/' + id)
          .then(res => {
            if (res.status != 200)
              return console.log(res);

            $scope.admins = _.filter($scope.admins, admin => admin._id != id);
          });
      });
    };

    $scope.showAdminModal = admin => {
      $scope.currentAdmin = admin ? _.clone(admin) : null;
      angular.element('#admin-modal').modal();
    };

    $scope.updateAdmin = admin => {
      $http.post('/api/auth/update', admin).then(res => {
        if (res.status != 200)
          return console.log(res);

        let index = _.findIndex($scope.admins, {_id: admin._id});
        $scope.admins.splice(index, 1, res.data);

        angular.element('#admin-modal').modal('hide');
      });
    };

    $scope.getAdmins();
  });