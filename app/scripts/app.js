angular.module('Ads', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/home.html',
      controller : 'HomeCtrl as homeCtrl'
    });

    $routeProvider.otherwise({
      redirectTo: '/'
    });
  });
