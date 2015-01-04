angular.module('Ads')
  .factory('RESTRequester', ['$http',
    function($http) {
      var baseURL = 'http://localhost:1337/api/',
          pageSize = 4;
      var User = {
        login : function(user) {
          return $http.post(baseURL + 'user/Login', user);
        },
        register: function (data) {
          return $http.post(baseURL + 'user/Register', data);
        }
      }
      var get = {
        ads : function(filters) {
          return $http.get(baseURL + 'Ads?PageSize='+ pageSize +'' + filters);
        },
        towns :function () {
          return $http.get(baseURL + 'Towns');
        },
        categories : function() {
          return $http.get(baseURL + 'Categories');
        }
      }
      return {
        User : User,
        get : get
      }
  }]) 
  .factory('UserService', ['RESTRequester', '$location',
    function(RESTRequester, $location) {
      var service = {
        isLoggedIn: false,
        user : {},

        login: function(user) {
          this.isLoggedIn = true;
          this.user = user;
          $location.path('/');
        },
        logout: function() {
          this.isLoggedIn = false;
          this.user = {};
          $location.path('/');
        }
      };
      return service;
  }]);
