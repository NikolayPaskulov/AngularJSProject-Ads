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
    $routeProvider.otherwise({
      redirectTo: '/'
    });
  });
