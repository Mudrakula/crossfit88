'use strict';

angular.module('crossfit88App')
  .factory('Authentication', ['$http', '$cookies', function($http, $cookies) {
    return {
      user: null,
      login: credentials => {
        if (this.user && this.user.username)
          return Promise.resolve(this.user);

        return $http.post('/api/auth/login', credentials)
        .then(res => {
          if (res.status !== 200) {
            console.log(res);
            return Promise.reject('Server error');
          }

          if (res.data.status !== 'success')
            return Promise.reject('Wrong password or username.');

          this.user = {
            username: res.data.admin.username,
            id: res.data.admin._id
          };
          $cookies.putObject('user', this.user);
          return Promise.resolve(this.user);
        });
      },
      registration: credentials => {
        return $http.post('/api/auth/registration', credentials)
        .then(res => {
          if (res.status !== 200) {
            console.log(res);
            return Promise.reject('Server error');
          }

          if (res.data.status !== 'success')
            return Promise.reject('Passwords not match.');

          this.user = {
            username: res.data.admin.username,
            id: res.data.admin._id
          };
          $cookies.putObject('user', this.user);
          return Promise.resolve(this.user);
        });
      },
      logout: () => {
        $cookies.remove('user');
        this.user = null;
      },
      getUser: () => {
        let user = $cookies.getObject('user');
        this.user = user;

        return this.user;
      }
    };
  }]);