'use strict';

angular.module('crossfit88App')
  .controller('TrainerCtrl', function($scope, trainer) {
    $scope.trainer = trainer;
    $scope.weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    $scope.trainings = {};
    $scope.selectedDay = moment();
    $scope.dayTrainings = [];

    $scope.getTrainings = date => {
      return _.filter($scope.trainer.trainings, training => moment(+training.date).isSame(moment(+date), 'day'));
    };

    $scope.getMonth = date => {
      let days = date.daysInMonth();
      let weeks = Math.ceil(days / 7);
      let firstDay = date.startOf('month').startOf('isoweek');
      let firstDayNumber = firstDay.format('d');
      let month = [];
      for (let i = 0; i < weeks; i++) {
        month[i] = [];
        for (let j = 0; j < 7; j++) {
          let tmp = moment(firstDay.toDate());
          month[i][j] = tmp.add(j, 'd').format('x');
          $scope.trainings[month[i][j]] = $scope.getTrainings(month[i][j]);
        }
        firstDay.add(1, 'w').startOf('isoweek');
        firstDayNumber = firstDay.format('d');
      }

      $scope.dayTrainings = $scope.trainings[date.startOf('day').format('x')];

      return month;
    };
    $scope.month = $scope.getMonth(moment());

    $scope.checkDay = date => {
      let day = moment(+date);
      return {
        disabled: ! day.isSame(moment(), 'month'),
        selected: day.isSame($scope.selectedDay, 'day'),
        clickable: $scope.trainings[date].length
      };
    };

    $scope.changeDay = date => {
      $scope.selectedDay = moment(+date);
      $scope.dayTrainings = $scope.trainings[date];
    };
  });