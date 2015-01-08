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
  .controller('UserAds', ['RESTRequester','UserService', '$route','$location',
   function(RESTRequester, UserService,$route, $location){
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
          //TODO NOTY
        })
        .error(function(data) {
          //TODO NOTY
        })
    }
    self.delete = function(id) {
      $location.path('/user/ads/delete/' + id)
    }
    self.publishAgain = function(id) {
      RESTRequester.User.publishAgainAd(id, UserService.user.access_token)
        .success(function(data) {
          $route.reload()
        })
        .error(function(data) {

        })
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
  .controller('DeleteAdCtrl', ['RESTRequester', 'UserService','$location','$routeParams',
    function(RESTRequester,UserService, $location,$routeParams){
      var self = this;
      self.delAd;

      self.isoToDate = function(str) {
            var d = new Date(str).toDateString().split(' ').slice(1);
             return  d[1] + '-' + d[0] + '-' + d[2];
      }

    RESTRequester.User.getAds('',UserService.user.access_token)
      .success(function(data) {
        for (var i = 0; i < data.ads.length; i++) {
          if(data.ads[i].id == $routeParams.ad){
            self.delAd = data.ads[i]
            break;
          }
        };
      })

      self.deleteAd = function() {
        console.log(UserService.user.access_token)
        RESTRequester.User.deleteAd(self.delAd.id, UserService.user.access_token)
          .success(function(data) {
            $location.path('/user/ads')
          })
          .error(function(data) {

          })
      }
  }])
  