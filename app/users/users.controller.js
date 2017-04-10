'use strict';

angular.module('crossfit88App')
  .controller('UsersCtrl', function($scope, $http) {
    $scope.users = [];
    $scope.tickets = [];
    $scope.trainers = [];
    $scope.currentUser = null;
    $scope.currentTrainer = null;
    $scope.currentTicket = null;
    $scope.getUsers = () => {
      $http.get('/api/users').then(res => {
        $scope.users = res.data;
        console.log(res.data);
      });
    };

    $scope.getTickets = () => {
      $http.get('/api/tickets').then(res => {
        $scope.tickets = res.data;
        $scope.currentTicket = $scope.tickets[0];
      });
    };

    $scope.getTrainers = () => {
      $http.get('/api/trainers').then(res => {
        $scope.trainers = res.data;
        $scope.currentTrainer = $scope.trainers[0];
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

    $scope.updateUser = (user, ticket) => {
      if (! user.ticket || user.ticket.title != ticket.title) {
        user.ticket = _.clone(ticket);
        user.ticket.startDate = moment().format('X');
        user.ticket.endDate = moment().add(30, 'd').format('X');
        user.ticket.status = 1;
      }

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

    $scope.getRaminingDays = date => {
      return moment(date, 'X').fromNow();
    };

    $scope.getUsers();
    $scope.getTickets();
    $scope.getTrainers();
  });