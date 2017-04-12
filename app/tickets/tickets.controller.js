'use strict';

angular.module('crossfit88App')
  .controller('TicketsCtrl', function($scope, $http) {
    $scope.tickets = [];
    $scope.currentTicket = null;

    $scope.getTickets = () => {
      $http.get('/api/tickets').then(res => {
        $scope.tickets = res.data;
      });
    };

    $scope.deleteTicket = id => {
      swal({
        title: 'Are you sure?',
        type: 'warning',
        showCancelButton: true
      }, () => {
        $http.post('/api/tickets/delete', {
          id: id
        }).then(res => {
          if (res.status != 200)
            return console.log(res);

          $scope.tickets = _.filter($scope.tickets, ticket => ticket._id != id);
        });
      });
    };

    $scope.showTicketModal = ticket => {
      $scope.currentTicket = ticket ? _.clone(ticket) : null;
      angular.element('#ticket-modal').modal();
    };

    $scope.updateTicket = ticket => {
      $http.post('/api/tickets/update', ticket).then(res => {
        if (res.status != 200)
          return console.log(res);

        if (ticket._id) {
          let index = _.findIndex($scope.tickets, {_id: ticket._id});
          $scope.tickets.splice(index, 1, res.data);
        } else {
          $scope.tickets.push(res.data);
        }

        angular.element('#ticket-modal').modal('hide');
      });
    };

    $scope.getTickets();
  });