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
        },
        getAds : function(filters, token) {
          return $http.get(baseURL + 'user/Ads?PageSize='+ pageSize +'' + filters,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        publishAd : function(adData,token) {
          console.log(adData)
          return $http.post(baseURL + 'user/Ads', adData,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        profile : function(token) {
          return $http.get(baseURL + 'user/Profile',
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        deactivateAd: function(id, token) {
           return $http.put(baseURL + 'user/Ads/Deactivate/' + id,null,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        deleteAd : function(id,token) {
          return $http.delete(baseURL + 'user/Ads/' + id,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        publishAgainAd: function(id, token) {
           return $http.put(baseURL + 'user/Ads/PublishAgain/' + id,null,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        getAdById: function(id,token) {
           return $http.get(baseURL + 'user/Ads/' + id,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        editUser: function(data,token) {
           return $http.put(baseURL + 'user/Profile',data, 
             { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        changePassword: function(data,token) {
            return $http.put(baseURL + 'user/ChangePassword',data, 
             { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        editAd: function(id,data,token) {
            return $http.put(baseURL + 'user/Ads/' + id,data, 
             { "headers" : { "Authorization": 'Bearer ' + token}});
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
          console.log(user)
          this.isLoggedIn = true;
          this.user = user;
          if(user.isAdmin) {
            $location.path('/admin/home');
          }else {
            $location.path('/');
          }

        },
        logout: function() {
          this.isLoggedIn = false;
          this.user = {};
          $location.path('/');
        }
      };
      return service;
  }])