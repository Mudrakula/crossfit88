'use strict';

angular.module('crossfit88App')
  .controller('SalesCtrl', function($scope, $http, sales) {
    $scope.sales = {};
    $scope.weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    $scope.trainings = {};
    $scope.selectedDay = moment();
    $scope.currentMonth = moment();
    $scope.daySales = [];
    $scope.monthLabels = {};

    $scope.getSales = date => {
      return _.filter(sales, sale => moment(+sale.date).isSame(moment(+date), 'day'));
    };

    $scope.getMonth = date => {
      let month = [];
      let days = date.daysInMonth();
      let weeks = Math.ceil(days / 7);
      let firstDay = moment(date.format('x'), 'x').startOf('month');

      if (days + firstDay.isoWeekday() - 1 > weeks * 7)
        weeks++;

      firstDay.startOf('isoweek');
      for (let i = 0; i < weeks; i++) {
        month[i] = [];
        for (let j = 0; j < 7; j++) {
          let tmp = moment(firstDay.format('x'), 'x');
          month[i][j] = tmp.add(j, 'd').format('x');
          $scope.sales[month[i][j]] = $scope.getSales(month[i][j]);
        }
        firstDay.add(1, 'w').startOf('isoweek');
      }

      $scope.daySales = $scope.sales[date.startOf('day').format('x')];
      let tmpDate = moment(date.format('x'), 'x');
      $scope.monthLabels = {
        prev: tmpDate.add(-1, 'months').format('MMMM'),
        next: tmpDate.add(2, 'months').format('MMMM')
      };

      return month;
    };
    $scope.month = $scope.getMonth($scope.currentMonth);

    $scope.changeMonth = direction => {
      $scope.currentMonth.add(direction, 'months');
      $scope.month = $scope.getMonth($scope.currentMonth);
    }

    $scope.checkDay = date => {
      let day = moment(+date);
      let month = $scope.currentMonth || moment();
      return {
        disabled: ! day.isSame($scope.currentMonth, 'month'),
        selected: day.isSame($scope.selectedDay, 'day'),
        clickable: $scope.sales[date].length
      };
    };

    $scope.changeDay = date => {
      $scope.selectedDay = moment(+date);
      $scope.daySales = $scope.sales[date];
    };

    $scope.getTotal = sales => {
      return _.reduce(sales, (result, sale) => result + sale.cost * sale.count, 0);
    };

    $scope.getNetProfit = sales => {
      return _.reduce(sales, (result, sale) => result + (sale.cost - sale.purchaseCost) * sale.count, 0);
    };

    $scope.export = (fromDate, toDate) => {
      var fromDate = moment(fromDate, 'DD.MM.YYYY').startOf('day').format('x');
      var toDate = moment(toDate, 'DD.MM.YYYY').endOf('day').format('x');

      $http.post('/api/sales/export', {
        fromDate: fromDate,
        toDate: toDate
      })
        .then(res => {
          if (res.status !== 200) {
            swal({
              title: 'Server error',
              text: 'Please, try again',
              type: 'error',
              timer: 1000,
              showConfirmButton: false
            });
            return console.log('Server error');
          }

          angular.element('<a/>')
            .attr({
              href: encodeURI(res.data),
              target: '_blank',
              download: _.last(res.data.split('/'))
            })[0].click();
        });
    };

    angular.element('#from-date').datepicker({
        autoclose: true,
        container: '#export-modal .modal-body',
        format: 'dd.mm.yyyy',
        todayHighlight: true
      });

    angular.element('#to-date').datepicker({
        autoclose: true,
        container: '#export-modal .modal-body',
        format: 'dd.mm.yyyy',
        todayHighlight: true
      });
  });