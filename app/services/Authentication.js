'use strict';

angular.module('crossfit88App')
  .factory('Authentication', ['$http', '$cookies', function($http, $cookies) {
    return {
      user: {},
      error: '',
      login: credentials => {
        if (this.user)
          return Promise.resolve(this.user);

        return $http.post('/api/auth/login', credentials)
        .then(res => {
          if (res.status !== 200) {
            console.log(res);
            return Promise.reject('Server error');
          }

          if (res.data.status !== 'success') {
            this.error = 'Wrong password or username.';
            return Promise.reject(this.error);
          }

          this.user = {
            username: res.data.admin.username,
            id: res.data.admin._id
          };
          $cookies.putObject('user', this.user);
          return Promise.resolve(this.user);
        });
      }
    };
  }]);