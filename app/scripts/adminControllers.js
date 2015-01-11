angular.module('Ads')
.controller('AdHomeCtrl', ['RESTRequester','UserService','$route','NOTY',
    function(RESTRequester, UserService, $route, NOTY){
      var self = this,
          filter,
          currentPage = 1;
      self.pages = [];
      self.ads = [];
      self.towns = [{ id : 0, name : '(None)'}];
      self.categories = [{ id : 0, name : '(None)'}];
      self.selectedTown;
      self.selectedCat;
      self.selectedStatus;

      //GET ALL ADS
      RESTRequester.Admin.getAds('', UserService.user.access_token)
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
        filter += ( self.selectedStatus &&  self.selectedStatus != -1) ? '&Status=' +  self.selectedStatus : '';
      RESTRequester.Admin.getAds(filter, UserService.user.access_token)
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

      self.approve = function(id) {
      	RESTRequester.Admin.approveAd(id,UserService.user.access_token)
        	.success(function(data) {
              NOTY.infoMsg('Ad is aprroved!')
          		$route.reload()
        	})
        	.error(function(data) {
            NOTY.errorMsg('Something goes WRONG!')
        	})
      }

      self.reject = function(id) {
      	RESTRequester.Admin.rejectAd(id,UserService.user.access_token)
        	.success(function(data) {
               NOTY.infoMsg('Ad is rejected!')
          		$route.reload()
        	})
        	.error(function(data) {
            NOTY.errorMsg('Something goes WRONG!')
        	})
      }
  }])
.controller('AdminDelCtrl', ['RESTRequester','UserService','$location','$routeParams',
 function(RESTRequester,UserService,$location,$routeParams){
	var self = this;
	self.delAd;

	RESTRequester.Admin.getAdById($routeParams.ad,UserService.user.access_token)
		.success(function(data) {
			self.delAd = data;
		});

	self.delete = function() {
		RESTRequester.Admin.deleteAd($routeParams.ad,UserService.user.access_token)
			.success(function(data) {
        NOTY.infoMsg('Ad is deleted!')
				$location.path('/admin/ads');
			})
      .error(function(data) {
            NOTY.errorMsg('Something goes WRONG!')
      })
	}
}])
.controller('AdminUsersCtrl', ['RESTRequester', 'UserService', 'HelperFuncs',
  function(RESTRequester, UserService, HelperFuncs){
  var self = this,
      sorted = {username : false, name : false, email: false, phoneNumber: false}
  self.users = [];


  RESTRequester.Admin.getUsers('', UserService.user.access_token)
    .success(function(data) {
      self.users = data.users;
    })

    self.sortBy = function(data) {
      self.users = HelperFuncs.sortBy(self.users, data, sorted[data]);
      sorted[data] = !sorted[data];
    }
}])
.controller('AdminCategoriesCtrl', ['RESTRequester', 'UserService','HelperFuncs',
  function(RESTRequester, UserService, HelperFuncs){
  var self = this,
      sorted = {id : false, username : false}
  self.categories = [];

  RESTRequester.Admin.getCategories('', UserService.user.access_token)
    .success(function(data) {
      self.categories = data.categories;
    })

  self.sortBy = function(data) {
      self.categories = HelperFuncs.sortBy(self.categories, data, sorted[data]);
      sorted[data] = !sorted[data];
  }
}])
.controller('AdminTownsCtrl', ['RESTRequester', 'UserService','HelperFuncs',
  function(RESTRequester, UserService, HelperFuncs){
  var self = this,
      sorted = {id : false, username : false}
  self.towns = [];

  RESTRequester.Admin.getTowns('', UserService.user.access_token)
    .success(function(data) {
      self.towns = data.towns;
    })

  self.sortBy = function(data) {
      self.towns = HelperFuncs.sortBy(self.towns, data, sorted[data]);
      sorted[data] = !sorted[data];
  }
}])
.controller('AdminTownCreateCtrl', ['RESTRequester','UserService', 'NOTY','$location',
  function(RESTRequester, UserService, NOTY,$location){
  var self = this;
  self.town = {};

  self.create = function() {
    if(!self.town.name || self.town.name == '') {
      NOTY.errorMsg('Enter town name!');
      return;
    }
    RESTRequester.Admin.createTown(self.town, UserService.user.access_token)
      .success(function(data) {
        NOTY.infoMsg('Town was successfully created!');
        $location.path('/admin/towns')
      })
      .error(function(data) {
        NOTY.errorMsg('Something goes WRONG');
      })
  }
}])
.controller('AdminCatCreateCtrl', ['RESTRequester','UserService', 'NOTY','$location',
  function(RESTRequester, UserService, NOTY,$location){
  var self = this;
  self.category = {};

  self.create = function() {
    if(!self.category.name || self.category.name == '') {
      NOTY.errorMsg('Enter category name!');
      return;
    }
    RESTRequester.Admin.createCategory(self.category, UserService.user.access_token)
      .success(function(data) {
        NOTY.infoMsg('Category was successfully created!');
        $location.path('/admin/categories')
      })
      .error(function(data) {
        NOTY.errorMsg('Something goes WRONG');
      })
  }
}])