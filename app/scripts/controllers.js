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
      self.towns = [{ id : 0, name : '(None)'}];
      self.categories = [{ id : 0, name : '(None)'}];

      //GET ALL ADS
      RESTRequester.get.ads('')
        .success(function(data) { 
          self.ads = data.ads;
        })

      //GET ALL ADS
      RESTRequester.get.towns()
        .success(function(data) { 
          self.towns = self.towns.concat(data);
        })

      //GET ALL ADS
      RESTRequester.get.categories()
        .success(function(data) { 
          self.categories = self.categories.concat(data);
        })
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
      }

  }])
  .controller('RegisterCtrl', ['UserService','RESTRequester',
    function(UserService, RESTRequester){
      var self = this;
      self.user = {};
      self.towns = [{ id : 0, name : '(None)'}];

      RESTRequester.get.towns()
        .success(function(data) { 
          self.towns = self.towns.concat(data);
        })

        
      self.submit = function() {
        if(self.user.townId == 0) delete self.user.townId
        RESTRequester.User.register(self.user)
          .success(function(data) {
            UserService.login(data)
          })
          .error(function(data) {
            //NOTY .. TODO!
          });
      }
  }])
  .controller('UserAds', ['RESTRequester','UserService', '$route','$routeScope'
   function(RESTRequester, UserService,$route){
    var self = this;
    self.ads = [];

    RESTRequester.User.getAds('', UserService.user.access_token)
      .success(function(data) {
        self.ads = data.ads;
      });

    self.deactivate = function(id) {
      RESTRequester.User.deactivateAd(id,UserService.user.access_token)
        .success(function(data) {
          $route.reload()
          console.log(data)
          //TODO NOTY
        })
        .error(function(data) {
          //TODO NOTY
        })
    }
    self.delete = function(id) {
      console.log(id)
    }

  }])
  .controller('NewAdCtrl', ['RESTRequester', 'UserService', '$scope', '$location',
    function(RESTRequester, UserService, $scope, $location){
      var self = this;
      self.adData = {townId: null, categoryId: null};
      self.towns = [{ id : null, name : '(None)'}];
      self.categories = [{ id : 0, name : '(None)'}];


      RESTRequester.get.towns()
        .success(function(data) { 
          self.towns = self.towns.concat(data);
        })

      RESTRequester.get.categories()
        .success(function(data) { 
          self.categories = self.categories.concat(data);
        })

      RESTRequester.User.profile(UserService.user.access_token)
        .success(function(data) {
          self.user = data
        })

        $scope.fileSelected = function(fileInputField) {
            delete self.adData.imageDataUrl;
            var file = fileInputField.files[0];
            if (file.type.match(/image\/.*/)) {
                var reader = new FileReader();
                reader.onload = function() {
                    self.adData.imageDataUrl = reader.result;
                    $(".image-box").html("<img src='" + reader.result + "'>");
                };
                reader.readAsDataURL(file);
            } else {
                $(".image-box").html("<p>File type not supported!</p>");
            }
        };

        self.publishAd = function() {
          RESTRequester.User.publishAd(self.adData, UserService.user.access_token)
            .success(function(data) {
              $location.path('/user/ads')
              //TODO NOTY
            })
            .error(function(data) {
              //TODO NOTY
            })
        };
  }])
  
  