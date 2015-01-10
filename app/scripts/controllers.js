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
    var self = this,
        filter,
        currentPage = 1;
    self.ads = [];
    self.pages = [];
    self.adsType;

    RESTRequester.User.getAds('', UserService.user.access_token)
      .success(function(data) {
        self.ads = data.ads;
        fillPager(data.numPages);
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

    self.change = function() {
      filter = (self.adsType == -1) ? '' : '&Status=' + self.adsType;
      RESTRequester.User.getAds(filter, UserService.user.access_token)
      .success(function(data) {
        self.ads = data.ads;
        fillPager(data.numPages);
      });
    }

    self.changePage = function(id) {
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

    function fillPager(num) {
        self.pages = [];
        for (var i = 1; i <= num; i++) {
          self.pages.push(i)
        }
      }

  }])
  .controller('NewAdCtrl', ['RESTRequester', 'UserService', '$scope', '$location',
    function(RESTRequester, UserService, $scope, $location){
      var self = this;
      self.adData = {townId: null, categoryId: null, imageDataUrl: null};
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
                    $(".image-box > img").attr('src', reader.result);
                };
                reader.readAsDataURL(file);
            } else {
               $(".image-box > img").attr('src', 'img/NoImgAvailable.png')
            }
        };

        self.publishAd = function() {
          console.log(self.adData)
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
  .controller('EditUserCtrl', ['RESTRequester','UserService', '$location',
    function(RESTRequester, UserService,$location){
      var self = this;
      self.user;
      self.towns = [{id : 0, name:'(None)'}];
      self.changePass = {};
    
      RESTRequester.get.towns()
        .success(function(data) {
          self.towns = self.towns.concat(data);
        })

      RESTRequester.User.profile(UserService.user.access_token)
        .success(function(data) {
          self.user = data;
        })

        self.update = function() {
          if(self.user.townId == 0) self.user.townId = null;
          RESTRequester.User.editUser(self.user,UserService.user.access_token)
            .success(function(data) {
              $location.path('/user/ads');
            })
            .error(function(data) {
              console.log(data)
            })
        }

        self.changePassword = function() {
          if(self.changePass.newPassword != self.changePass.confirmPassword){
            return;
          }
          RESTRequester.User.changePassword(self.changePass,UserService.user.access_token)
            .success(function(data) {
              $location.path('/user/ads')
            })
            .error(function(data) {

            })
        }
  }])
  .controller('EditAdCtrl', ['RESTRequester','UserService','$location','$routeParams','$scope',
   function(RESTRequester, UserService, $location, $routeParams,$scope){
      var self = this;
      self.editAd;
      self.towns = [{ id : 0, name : '(None)'}];
      self.categories = [{ id : 0, name : '(None)'}];


    RESTRequester.User.getAdById($routeParams.ad,UserService.user.access_token)
      .success(function(data) {
        self.editAd = data;
        console.log(data)
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

        $scope.fileSelected = function(fileInputField) {
            delete self.editAd.imageDataUrl;
            var file = fileInputField.files[0];
            if (file.type.match(/image\/.*/)) {
                var reader = new FileReader();
                reader.onload = function() {
                    self.editAd.imageDataUrl = reader.result;
                    $(".image-box > img").attr('src', reader.result);
                    $('#uploadFile').val($("#uploadBtn").val());
                };
                reader.readAsDataURL(file);
            } else {
               $(".image-box > img").attr('src', 'img/NoImgAvailable.png')
            }
        };

        self.changeImg = function() {
          self.editAd.changeImage = true;
        }

        self.delImg = function() {
          self.editAd.changeImage = true;
          self.editAd.imageDataUrl = null;
          $(".image-box > img").attr('src', 'img/NoImgAvailable.png')
        }

        self.edit = function() {
          RESTRequester.User.editAd($routeParams.ad, self.editAd, UserService.user.access_token)
            .success(function(data){
              $location.path('/user/ads');
            })
            .error(function(data) {

            })
        }
  }])