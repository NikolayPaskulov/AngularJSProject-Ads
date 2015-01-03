angular.module('Ads')
  .factory('RESTRequester', ['$http',
    function($http) {
      var baseURL = 'http://localhost:1337/api/',
          pageSize = 5;
      var User = {
        login : function(username,password) {
          return $http.post(baseURL + 'user/Login', { username : username, password : password});
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
  .factory('UserService', ['RESTRequester', function(RESTRequester) {
    var service = {
      isLoggedIn: false,
      user : {},

      login: function(user) {
        return $http.post('/api/login', user)
          .then(function(response) {
            service.isLoggedIn = true;
            return response;
        });
      }
    };
    return service;
  }]);
