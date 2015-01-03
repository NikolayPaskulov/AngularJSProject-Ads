angular.module('Ads')
  .factory('RESTRequester', ['$http',
    function($http) {

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
