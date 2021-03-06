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
    .when('/user/ads/delete/:ad', {
      templateUrl: 'views/deleteAd.html',
      controller : 'DeleteAdCtrl as delCtrl',
      resolve: {
        auth: ['$location', 'UserService',
          function($location, UserService) {
            if(!UserService.user.username) {
              $location.path('/login')
            }
        }]
      }
    })
    .when('/user/ads/edit/:ad', {
      templateUrl: 'views/editAd.html',
      controller : 'EditAdCtrl as editAdCtrl',
      resolve: {
        auth: ['$location', 'UserService',
          function($location, UserService) {
            if(!UserService.user.username) {
              $location.path('/login')
            }
        }]
      }
    })
    .when('/admin/ads', {
      templateUrl: 'views/adminHome.html',
      controller : 'AdHomeCtrl as adHomeCtrl',
      resolve: {
        auth: ['$location', 'UserService',
          function($location, UserService) {
            if(!UserService.user.isAdmin) {
              $location.path('/login')
            }
        }]
      }
    })
    .when('/admin/ads/delete/:ad', {
      templateUrl: 'views/adminDeleteAd.html',
      controller : 'AdminDelCtrl as adDelCtrl',
      resolve: {
        auth: ['$location', 'UserService',
          function($location, UserService) {
            if(!UserService.user.isAdmin) {
              $location.path('/login')
            }
        }]
      }
    })
    .when('/admin/ads/edit/:ad', {
      templateUrl: 'views/adminEditAd.html',
      controller : 'AdminEditAdCtrl as adEditAdCtrl',
      resolve: {
        auth: ['$location', 'UserService',
          function($location, UserService) {
            if(!UserService.user.isAdmin) {
              $location.path('/login')
            }
        }]
      }
    })
    .when('/admin/users', {
      templateUrl: 'views/adminUsers.html',
      controller : 'AdminUsersCtrl as adUsersCtrl',
      resolve: {
        auth: ['$location', 'UserService',
          function($location, UserService) {
            if(!UserService.user.isAdmin) {
              $location.path('/login')
            }
        }]
      }
    })
    .when('/admin/categories', {
      templateUrl: 'views/adminCategories.html',
      controller : 'AdminCategoriesCtrl as adCatCtrl',
      resolve: {
        auth: ['$location', 'UserService',
          function($location, UserService) {
            if(!UserService.user.isAdmin) {
              $location.path('/login')
            }
        }]
      }
    })
    .when('/admin/towns', {
      templateUrl: 'views/adminTowns.html',
      controller : 'AdminTownsCtrl as adTownsCtrl',
      resolve: {
        auth: ['$location', 'UserService',
          function($location, UserService) {
            if(!UserService.user.isAdmin) {
              $location.path('/login')
            }
        }]
      }
    })
    .when('/admin/town/create', {
      templateUrl: 'views/adminTownCreate.html',
      controller : 'AdminTownCreateCtrl as adTownCreateCtrl',
      resolve: {
        auth: ['$location', 'UserService',
          function($location, UserService) {
            if(!UserService.user.isAdmin) {
              $location.path('/login')
            }
        }]
      }
    })
    .when('/admin/town/edit', {
      templateUrl: 'views/adminTownEdit.html',
      controller : 'AdminTownEditCtrl as adTownEditCtrl',
      resolve: {
        auth: ['$location', 'UserService',
          function($location, UserService) {
            if(!UserService.user.isAdmin) {
              $location.path('/login')
            }
        }]
      }
    })
    .when('/admin/town/delete', {
      templateUrl: 'views/adminTownDel.html',
      controller : 'AdminTownDelCtrl as adTownDelCtrl',
      resolve: {
        auth: ['$location', 'UserService',
          function($location, UserService) {
            if(!UserService.user.isAdmin) {
              $location.path('/login')
            }
        }]
      }
    })
    .when('/admin/category/create', {
      templateUrl: 'views/adminCategoryCreate.html',
      controller : 'AdminCatCreateCtrl as adCatCreateCtrl',
      resolve: {
        auth: ['$location', 'UserService',
          function($location, UserService) {
            if(!UserService.user.isAdmin) {
              $location.path('/login')
            }
        }]
      }
    })
    $routeProvider.otherwise({
      redirectTo: '/'
    });
  });
