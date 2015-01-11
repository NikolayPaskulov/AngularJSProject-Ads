angular.module('Ads')
  .controller('MainCtrl', ['UserService', '$rootScope','NOTY',
   function(UserService, $rootScope, NOTY){
    var self = this;
    self.user = UserService.user;


    self.logout = function() {
      UserService.logout();
      self.user =  {isLoggedIn: false};
      NOTY.infoMsg('Successfully logout!');
    }

    $rootScope.$on('userLogin', function(event,user) {
       self.user = user;
       self.user.isLoggedIn = true;
    })
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
          fillPager(data.numPages);
        })
      }

      self.update = function(asd) {
        filter = (self.selectedTown && self.selectedTown != 0) ? '&TownId=' +  self.selectedTown : '';
        filter += (self.selectedCat && self.selectedCat != 0) ? '&CategoryId=' +  self.selectedCat : '';
        RESTRequester.get.ads(filter)
        .success(function(data) {
          fillPager(data.numPages);
          self.ads = data.ads;
        })
      }

      function fillPager(num) {
        self.pages = [];
        var len = ((num - currentPage) > 7) ? currentPage + 7 : currentPage + (7 - num - currentPage);
        var start = ((num - currentPage) > 7) ? currentPage : num - currentPage;
        for (var i = start; i < len; i++) {
          self.pages.push(i);
        };
      }
  }])
  .controller('LoginCtrl', ['UserService','RESTRequester','$rootScope','NOTY',
    function(UserService, RESTRequester, $rootScope, NOTY){
      var self = this;
      self.user = {};

      self.submit = function() {
        RESTRequester.User.login(self.user)
          .success(function(data) {
            $rootScope.$broadcast('userLogin', data);
            UserService.login(data);
            NOTY.infoMsg('Successfully login!')
          })
          .error(function(data){
            NOTY.errorMsg(data.error_description);
          })
      }

  }])
  .controller('RegisterCtrl', ['UserService','RESTRequester','NOTY','$rootScope',
    function(UserService, RESTRequester, NOTY, $rootScope){
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
            $rootScope.$broadcast('userLogin', data);
            UserService.login(data)
            NOTY.infoMsg('Successfully register. Welcome!')
          })
          .error(function(data) {
            NOTY.errorMsg(data.modelState[""][0])
          });
      }
  }])
  .controller('UserAds', ['RESTRequester','UserService', '$route','$location','NOTY',
   function(RESTRequester, UserService,$route, $location, NOTY){
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
          NOTY.infoMsg('Ad is deactivated!')
          $route.reload()
        })
        .error(function(data) {
          NOTY.errorMsg('Something goes WRONG!')
        })
    }

    self.publishAgain = function(id) {
      RESTRequester.User.publishAgainAd(id, UserService.user.access_token)
        .success(function(data) {
          NOTY.infoMsg('Your Ad is published again!')
          $route.reload()
        })
        .error(function(data) {
          NOTY.errorMsg('Something goes WRONG!')
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
          fillPager(data.numPages);
        })
      }

      function fillPager(num) {
        self.pages = [];
        var len = ((num - currentPage) > 7) ? currentPage + 7 : currentPage + (7 - num - currentPage);
        var start = ((num - currentPage) > 7) ? currentPage : num - currentPage;
        for (var i = start; i < len; i++) {
          self.pages.push(i);
        };
      }

  }])
  .controller('NewAdCtrl', ['RESTRequester', 'UserService', '$scope', '$location', 'NOTY',
    function(RESTRequester, UserService, $scope, $location, NOTY){
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
              NOTY.infoMsg('Ad is succesfully published!')
              $location.path('/user/ads')
            })
            .error(function(data) {
              NOTY.infoMsg('Something goes WRONG!')
            })
        };
  }])
  .controller('DeleteAdCtrl', ['RESTRequester', 'UserService','$location','$routeParams', 'NOTY',
    function(RESTRequester,UserService, $location,$routeParams, NOTY){
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
            NOTY.infoMsg('Ad is deleted!')
            $location.path('/user/ads')
          })
          .error(function(data) {
              NOTY.infoMsg('Something goes WRONG!')
          })
      }
  }])
  .controller('EditUserCtrl', ['RESTRequester','UserService', '$location', 'NOTY',
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
              NOTY.infoMsg('User is updated!')
              $location.path('/user/ads');
            })
            .error(function(data) {
              NOTY.errorMsg('Something goes WRONG!')
            })
        }

        self.changePassword = function() {
          if(self.changePass.newPassword != self.changePass.confirmPassword){
            NOTY.errorMsg('Passwords dont match!')
            return;
          }
          RESTRequester.User.changePassword(self.changePass,UserService.user.access_token)
            .success(function(data) {
              NOTY.infoMsg('Successfully changed user password!');
              $location.path('/user/ads')
            })
            .error(function(data) {
              NOTY.errorMsg('Something goes Wrong!');
            })
        }
  }])
  .controller('EditAdCtrl', ['RESTRequester','UserService','$location','$routeParams','$scope','NOTY',
   function(RESTRequester, UserService, $location, $routeParams,$scope, NOTY){
      var self = this;
      self.editAd;
      self.towns = [{ id : 0, name : '(None)'}];
      self.categories = [{ id : 0, name : '(None)'}];


    RESTRequester.User.getAdById($routeParams.ad,UserService.user.access_token)
      .success(function(data) {
        self.editAd = data;
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
              NOTY.infoMsg('Ad is successfully edited!')
              $location.path('/user/ads');
            })
            .error(function(data) {
              NOTY.errorMsg('Something goes WRONG');
            })
        }
  }])