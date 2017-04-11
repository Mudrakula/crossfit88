'use strict';

angular.module('crossfit88App')
  .controller('UsersCtrl', function($scope, $http, $location) {
    $scope.users = [];
    $scope.tickets = [];
    $scope.trainers = [];
    $scope.currentUser = null;
    $scope.currentTicket = null;
    $scope.search = {
      query: '',
      trainer: '',
      ticket: ''
    }
    $scope.getUsers = () => {
      let queryString = _.reduce($scope.search, (result, value, key) => result + key + '=' + value + '&', '?');
      $http.get('/api/users'+queryString).then(res => {
        $scope.users = res.data;
        console.log(res.data);
      });
    };

    $scope.getTickets = query => {
      $http.get('/api/tickets?query='+query).then(res => {
        $scope.tickets = res.data;
        $scope.currentTicket = $scope.tickets[0];
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
      $scope.currentUser = user ? _.clone(user) : {trainer: $scope.trainers[0]};
      angular.element('#user-modal').modal();
    };

    $scope.updateUser = (user, ticket) => {
      if (! user.ticket || user.ticket._id != ticket._id)
        user.ticket = _.clone(ticket);

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
        ticket = null;
        angular.element('#user-modal').modal('hide');
      });
    };

    $scope.getRaminingDays = date => {
      return date ? moment(date, 'X').fromNow() : 'Not started';
    };

    $scope.checkTraining = user => {
      return ! _.some(user.ticket.trainings, date => moment().isSame(date, 'day'));
    };

    $scope.addTraining = inUser => {
      let user = _.clone(inUser)
      if (! user.ticket.startDate) {
        user.ticket.startDate = moment().format('X');
        user.ticket.endDate = moment().add(30, 'd').format('X');
      }
      user.ticket.trainings.remain--;
      user.ticket.trainings.used.push(moment().format('X'));

      $http.post('/api/users/update', user).then(res => {
        if (res.status != 200)
          return console.log(res);

        let index = _.findIndex($scope.users, {_id: user._id});
        $scope.users.splice(index, 1, res.data);
      });
    };

    $scope.getUsers();
    $scope.getTickets();
    $scope.getTrainers();
  });