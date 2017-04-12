'use strict';

angular.module('crossfit88App')
  .controller('UsersCtrl', function($scope, $http, $location) {
    $scope.users = [];
    $scope.tickets = [];
    $scope.trainers = [];
    $scope.currentUser = null;
    $scope.pagesCount = 1;
    $scope.search = {
      query: '',
      trainer: '',
      ticket: '',
      limit: 5,
      page: 0
    };
    $scope.getUsers = () => {
      let queryString = _.reduce($scope.search, (result, value, key) => result + key + '=' + value + '&', '?');
      $http.get('/api/users'+queryString).then(res => {
        $scope.users = res.data.users;
        $scope.pagesCount = Math.ceil(res.data.count / $scope.search.limit);
      });
    };

    $scope.getTickets = query => {
      $http.get('/api/tickets?query='+query).then(res => {
        $scope.tickets = res.data;
      });
    };

    $scope.getTrainers = () => {
      $http.get('/api/trainers').then(res => {
        $scope.trainers = res.data;
      });
    };

    $scope.deleteUser = id => {
      swal({
        title: 'Are you sure?',
        type: 'warning',
        showCancelButton: true
      }, () => {
        $http.post('/api/users/delete', {
          id: id
        }).then(res => {
          if (res.status != 200)
            return console.log(res);

          $scope.users = _.filter($scope.users, user => user._id != id);
        });
      });
    };

    $scope.showUserModal = user => {
      if (user) {
        $scope.currentUser = _.assign({}, user, {
          trainer: user.trainer._id,
          ticket: user.ticket
        });
      } else {
        $scope.currentUser = {
          trainer: $scope.trainers[0]._id,
          ticket: $scope.tickets[0]._id
        }
      }
      angular.element('#user-modal').modal();
    };

    $scope.updateUser = (user) => {
      $http.post('/api/users/update', user).then(res => {
        if (res.status != 200)
          return console.log(res);

        if (user._id) {
          let index = _.findIndex($scope.users, {_id: user._id});
          $scope.users.splice(index, 1, res.data);
        } else {
          $scope.users.push(res.data);
        }

        user = null;
        angular.element('#user-modal').modal('hide');
      });
    };

    $scope.getRaminingDays = date => {
      return date ? moment(date).fromNow() : 'Not started';
    };

    $scope.checkTraining = user => {
      return ! _.some(user.trainings, date => moment().isSame(date, 'day'));
    };

    $scope.addTraining = inUser => {
      let user = _.clone(inUser)
      if (! user.trainings.startDate) {
        user.trainings.startDate = moment().format('x');
        user.trainings.endDate = moment().add(30, 'd').format('x');
      }
      user.trainings.remain--;
      user.trainings.used.push(moment().format('x'));

      $http.post('/api/users/update', user).then(res => {
        if (res.status != 200)
          return console.log(res);

        let index = _.findIndex($scope.users, {_id: user._id});
        $scope.users.splice(index, 1, res.data);
      });
    };

    $scope.gotoPage = page => {
      $scope.search.page = page;
      $scope.getUsers();
    };

    $scope.getUsers();
    $scope.getTickets();
    $scope.getTrainers();
  });