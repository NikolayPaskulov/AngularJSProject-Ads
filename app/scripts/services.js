angular.module('Ads')
  .factory('RESTRequester', ['$http',
    function($http) {
      var baseURL = 'http://softuni-ads.azurewebsites.net/api/',
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
        createTown: function(data, token) {
          return $http.post(baseURL + 'admin/Towns',data,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        deleteTown: function(id,token) {
            return $http.delete(baseURL + 'admin/Towns/' + id,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        editTown: function(id,data,token) {
            return $http.put(baseURL + 'admin/Towns/' + id,data,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        createCategory: function(data, token) {
            return $http.post(baseURL + 'admin/Categories',data,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        deleteCategory: function(id,token) {
            return $http.delete(baseURL + 'admin/Categories/' + id,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        },
        editCategory: function(id,data,token) {
            return $http.put(baseURL + 'admin/Categories/' + id,data,
            { "headers" : { "Authorization": 'Bearer ' + token}});
        }
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
        user : {isLoggedIn: false},

        login: function(user) {
          this.user = user;
          this.user.isLoggedIn = true;
          if(user.isAdmin) {
            $location.path('/admin/ads');
          }else {
            $location.path('/');
          }

        },
        logout: function() {
          this.user = {isLoggedIn: false};
          $location.path('/');
        }
      };
      return service;
  }])
  .factory('NOTY', [function() {
    var msg = {
      infoMsg : function(msg) {
         var n = noty({
            text: msg,
            type: 'info',
            layout: 'topCenter',
            timeout: 3000
        })
         return n;
      },
      errorMsg : function(msg) {
         var n = noty({
            text: msg,
            type: 'error',
            layout: 'topCenter',
            timeout: 3000
        });
         return n;
      }
    }

    return msg;
  }])
  .factory('HelperFuncs', [function() {
    function sortBy(arr,param,acc) {
      var curArr = arr;
      if(acc) {
        curArr.sort(function(a,b) {
          if(a[param] > b[param]) return 1;
          if(a[param] == b[param]) return 0;
          if(a[param] < b[param]) return -1;
        })
      } else {
        curArr.sort(function(a,b) {
          if(a[param] < b[param]) return 1;
          if(a[param] == b[param]) return 0;
          if(a[param] > b[param]) return -1;
        })
      }
      return curArr;
    }
    return {
      sortBy : sortBy
    }
  }])