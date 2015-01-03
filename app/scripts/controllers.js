angular.module('Ads')
  .controller('MainCtrl', ['UserService',
   function(UserService){
    this.userS = UserService;

  }])
  .controller('HomeCtrl', ['RESTRequester', 
    function(RESTRequester){
  }])