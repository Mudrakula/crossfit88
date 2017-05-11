'use strict';

angular.module('crossfit88App')
  .controller('UsersCtrl', function($scope, $http, $location, Authentication) {
    $scope.users = [];
    $scope.tickets = [];
    $scope.trainers = [];
    $scope.currentUser = null;
    $scope.pagesCount = 1;
    $scope.search = {
      query: '',
      status: '1',
      trainer: '',
      ticket: '',
      limit: 10,
      page: 0
    };

    $scope.getUsers = keepPage => {
      if (! keepPage)
        $scope.search.page = 0;

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
          ticket: user.ticket._id
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
      if (! user.trainings || ! user.trainings.remain)
        user.trainings = {
          remain: _.find($scope.tickets, ticket => ticket._id == user.ticket).trainingsCount
        };

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
      return _.some(user.trainings.used, date => moment().isSame(date, 'day'));
    };

    $scope.addTraining = inUser => {
      let user = _.clone(inUser)
      if (! user.trainings.startDate) {
        user.status = 1;
        user.trainings.startDate = moment().format('x');
        user.trainings.endDate = moment().add(user.ticket.daysCount, 'd').endOf('date').format('x');
      }
      user.trainings.remain--;
      user.trainings.used.push(moment().format('x'));

      if (! user.trainings.remain) {
        user.status = 0;
        user.trainings = {};
      }

      $http.post('/api/users/update', user).then(res => {
        if (res.status != 200)
          return console.log(res);

        let index = _.findIndex($scope.users, {_id: user._id});
        $scope.users.splice(index, 1, res.data);
      });

      let trainer = _.clone(inUser.trainer);
      trainer.trainings.push({
        user: inUser._id,
        date: moment().format('x')
      });
      $http.post('/api/trainers/update', trainer).then(res => console.log(res));
    };

    $scope.freeze = user => {
      swal({
        title: 'Are you sure?',
        type: 'warning',
        showCancelButton: true
      }, () => {
        user.remainDays = moment(user.trainings.endDate).diff(moment(), 'days');
        user.status = -1;
        $http.post('/api/users/update', user).then(res => {
          if (res.status != 200)
            return console.log(res);

          $scope.users = _.filter($scope.users, userTmp => userTmp._id != user._id);
        });
      });
    };

    $scope.defrost = user => {
      user.trainings.endDate = moment().add(user.remainDays, 'd').endOf('date').format('x');
      user.remainDays = null;
      user.status = 1;
      $http.post('/api/users/update', user).then(res => {
        if (res.status != 200)
          return console.log(res);

        $scope.users = _.filter($scope.users, userTmp => userTmp._id != user._id);
      });
    };

    $scope.gotoPage = page => {
      $scope.search.page = page;
      $scope.getUsers(true);
    };

    $scope.checkTickets = () => {
      $http.get('/api/users/check').then(res => $scope.getUsers());
    };

    // $scope.getUsers();
    $scope.getTickets();
    $scope.getTrainers();
    $scope.checkTickets();
  });