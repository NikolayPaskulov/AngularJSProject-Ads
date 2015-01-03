angular.module('Ads')
  .controller('MainCtrl', ['UserService',
   function(UserService){
    this.userS = UserService;
  }])
  .controller('HomeCtrl', ['RESTRequester', 
    function(RESTRequester){
      var self = this;
      self.ads = [];
      self.towns = [{ id : 0, name : 'All'}];
      self.categories = [{ id : 0, name : 'All'}];

      //GET ALL ADS
      RESTRequester.get.ads('')
        .success(function(data) { 
          self.ads = data.ads;
        }).
        error(function(data) {
          //NOTY .. TODO!
        });

      //GET ALL TOWNS
      RESTRequester.get.towns()
        .success(function(data) { 
          self.towns = self.towns.concat(data);
        }).
        error(function(data) {
          //NOTY .. TODO!
        });

      //GET ALL CATEGORIES
      RESTRequester.get.categories()
        .success(function(data) { 
          self.categories = self.categories.concat(data);
        }).
        error(function(data) {
          //NOTY .. TODO!
        });
  }])
  .controller('PageCtrl', [function(){
    
  }])