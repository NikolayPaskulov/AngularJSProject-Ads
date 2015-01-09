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
      var self = this,
          filter,
          currentPage = 1;
      self.pages = [];
      self.ads = [];
      self.towns = [{ id : 0, name : '(None)'}];
      self.categories = [{ id : 0, name : '(None)'}];
      self.selectedTown;
      self.selectedCat;

      //GET ALL ADS
      RESTRequester.get.ads('')
        .success(function(data) {
          self.ads = data.ads;
          fillPager(data.numPages);
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

      self.changePage = function(id) {
        console.log(self.pages.length)
        if(currentPage == id) return;
        if(id == 'next' && currentPage == self.pages.length) return;
        if(id == 'prev' && currentPage == 1) return;
        currentPage = (id == 'next') ? currentPage+ 1 : (id == 'prev') ? currentPage - 1 :
        id;
      RESTRequester.get.ads(((filter) ? filter : '') + '&StartPage=' + currentPage)
        .success(function(data) {
          self.ads = data.ads;
        })
      }

      self.update = function(asd) {
        filter = (self.selectedTown && self.selectedTown != 0) ? '&TownId=' +  self.selectedTown : '';
        filter += (self.selectedCat && self.selectedCat != 0) ? '&CategoryId=' +  self.selectedCat : '';
        RESTRequester.get.ads(filter)
        .success(function(data) {
          self.ads = data.ads;
          fillPager(data.numPages);
        })
      }

      function fillPager(num) {
        self.pages = [];
        for (var i = 1; i <= num; i++) {
          self.pages.push(i)
        }
      }
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

    RESTRequester.User.getAdById($routeParams.ad,UserService.user.access_token)
      .success(function(data) {
        self.delAd = data;
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
  .controller('EditUserCtrl', ['RESTRequester','UserService', 
    function(RESTRequester, UserService){
      var self = this;
      self.user;
      self.towns = [{id : 0, name:'(None)'}]
    
      RESTRequester.get.towns()
        .success(function(data) {
          self.towns = self.towns.concat(data);
        })

      RESTRequester.User.profile(UserService.user.access_token)
        .success(function(data) {
          self.user = data;
          console.log(data)
        })

  }])
  