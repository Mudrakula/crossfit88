'use strict';

angular.module('crossfit88App')
  .controller('MainCtrl', ['$scope', '$http', 'Authentication', function($scope, $http, Authentication) {
    console.log(Authentication);
    console.log('main works!');
  }]);