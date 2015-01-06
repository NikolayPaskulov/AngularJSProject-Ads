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
      self.towns = [{ id : 0, name : 'All'}];

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
  .controller('UserAds', ['RESTRequester','UserService',
   function(RESTRequester, UserService){
    var self = this;
    self.ads = [];

    RESTRequester.User.getAds('', UserService.user.access_token)
      .success(function(data) {
        self.ads = data.ads;
      });

    self.deactivate = function(id) {

    }

  }])
  .controller('NewAdCtrl', ['RESTRequester','UserService', '$scope',
    function(RESTRequester, UserService, $scope){
      var self = this;
      self.adData = {townId: null, categoryId: null};
      self.towns = [{ id : 0, name : 'All'}];
      self.categories = [{ id : 0, name : 'All'}];

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

        $scope.fileSelected = function(fileInputField) {
            delete self.adData.imageDataUrl;
            console.log(fileInputField.value)
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

        };
  }])
  
  