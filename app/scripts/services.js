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
      var Admin = {
        getAds : function(filters, token) {
          return $http.get(baseURL + 'admin/Ads?PageSize='+ pageSize +'' + filters,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        deleteAd : function(id,token) {
          return $http.delete(baseURL + 'admin/Ads/' + id,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        rejectAd: function(id, token) {
           return $http.put(baseURL + 'admin/Ads/Reject/' + id,null,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        approveAd: function(id,token) {
            return $http.put(baseURL + 'admin/Ads/Approve/' + id,null,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        getAdById: function(id,token) {
           return $http.get(baseURL + 'admin/Ads/' + id,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        getUsers : function(filters,token) {
          return $http.get(baseURL + 'admin/Users?PageSize='+ 1000 +'' + filters,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        getUserById: function(id, token) {
          return $http.get(baseURL + 'admin/Users/' + id,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        getCategories : function(filters,token) {
          return $http.get(baseURL + 'admin/Categories?PageSize='+ 1000 +'' + filters,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        getTowns: function(filters,token) {
          return $http.get(baseURL + 'admin/Towns?PageSize='+ 1000 +'' + filters,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
      }
      return {
        User : User,
        get : get,
        Admin: Admin
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
            $location.path('/admin/ads');
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