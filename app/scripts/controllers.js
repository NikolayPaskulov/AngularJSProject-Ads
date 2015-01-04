angular.module('Ads')
  .controller('MainCtrl', ['UserService',
   function(UserService){
    var self = this;
    self.user = UserService;

    self.logout = function() {
      UserService.logout();
    }
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
  .controller('LoginCtrl', ['UserService','RESTRequester',
    function(UserService, RESTRequester){
      var self = this;
      self.user = {};

      self.submit = function() {
        RESTRequester.User.login(self.user)
          .success(function(data) {
            UserService.login(data);
          })
          .error(function(data) {
            //NOTY .. TODO!
          });
      }

  }])
  .controller('RegisterCtrl', ['UserService','RESTRequester',
    function(UserService, RESTRequester){
      var self = this;
      self.user = {};
      self.towns = [{ id : 0, name : ''}];

      RESTRequester.get.towns()
        .success(function(data) { 
          self.towns = self.towns.concat(data);
          $('#reg-towns')[0].innerHTML = fillSelect(self.towns);
        }).
        error(function(data) {
          //NOTY .. TODO!
        });

      self.submit = function() {
        var select = $('#reg-towns')[0];
        if(select.value != 0) {
          self.user.townId = select.value
        } 
        RESTRequester.User.register(self.user)
          .success(function(data) {
            console.log(data)
            UserService.login(data)
          })
          .error(function(data) {
            //NOTY .. TODO!
          });
      }
      function fillSelect(arr) {
        var optionArray = [];
        for(var i = 0; i < arr.length; i++) {
          optionArray.push('<option value="'+ arr[i].id +'">'+ arr[i].name +'</option>')
        }
        return optionArray.join('');
      }
  }])
  
  