angular.module('Ads', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/home.html',
      controller : 'HomeCtrl as homeCtrl'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller : 'LoginCtrl as loginCtrl'
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller : 'RegisterCtrl as regCtrl'
    })
    .when('/user/ads', {
      templateUrl: 'views/userAds.html',
      controller : 'UserAds as userAds',
      resolve: {
        auth: ['$location', 'UserService',
          function($location, UserService) {
            if(!UserService.user.username) {
              $location.path('/login')
            }
        }]
      }
    })
    .when('/user/editProfile', {
      templateUrl: 'views/editUser.html',
      controller : 'EditUserCtrl as editUserCtrl',
      resolve: {
        auth: ['$location', 'UserService',
          function($location, UserService) {
            if(!UserService.user.username) {
              $location.path('/login')
            }
        }]
      }
    })
    .when('/user/newAd', {
      templateUrl: 'views/publishNewAd.html',
      controller : 'NewAdCtrl as newAdCtrl',
      resolve: {
        auth: ['$location', 'UserService',
          function($location, UserService) {
            if(!UserService.user.username) {
              $location.path('/login')
            }
        }]
      }
    })
    .when('/user/ads/delete', {
      templateUrl: 'views/deleteAd.html',
      controller : 'DeleteAdCtrl as delCtrl',
    })
    $routeProvider.otherwise({
      redirectTo: '/'
    });
  });
