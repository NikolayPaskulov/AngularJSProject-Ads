angular.module('Ads')
.controller('AdHomeCtrl', ['RESTRequester','UserService','$route',
    function(RESTRequester, UserService, $route){
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
          		$route.reload()
        	})
        	.error(function(data) {

        	})
      }

      self.reject = function(id) {
      	RESTRequester.Admin.rejectAd(id,UserService.user.access_token)
        	.success(function(data) {
          		$route.reload()
        	})
        	.error(function(data) {

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
				$location.path('/admin/ads');
			})
	}
}])
.controller('AdminUsersCtrl', ['RESTRequester', 'UserService',
  function(RESTRequester, UserService){
  var self = this,
      sorted = {username : false, name : false, email: false, phoneNumber: false}
  self.users = [];


  RESTRequester.Admin.getUsers('', UserService.user.access_token)
    .success(function(data) {
      self.users = data.users;
    })

    self.sortBy = function(data) {
      if(sorted[data]){
        self.users.sort(function(a,b) {
          if(a[data] < b[data]) return 1;
          if(a[data] == b[data]) return 0;
          if(a[data] > b[data]) return -1;
        })
      } else {
        self.users.sort(function(a,b) {
          if(a[data] > b[data]) return 1;
          if(a[data] == b[data]) return 0;
          if(a[data] < b[data]) return -1;
        })
      }
        sorted[data] = !sorted[data];
    }
}])
.controller('AdminCategoriesCtrl', ['RESTRequester', 'UserService',
  function(RESTRequester, UserService){
  var self = this,
      sorted = {id : false, username : false}
  self.categories = [];

  RESTRequester.Admin.getCategories('', UserService.user.access_token)
    .success(function(data) {
      self.categories = data.categories;
    })

  self.sortBy = function(data) {
    if(sorted[data]){
      self.categories.sort(function(a,b) {
        if(a[data] < b[data]) return 1;
        if(a[data] == b[data]) return 0;
        if(a[data] > b[data]) return -1;
      })
    } else {
      self.categories.sort(function(a,b) {
        if(a[data] > b[data]) return 1;
        if(a[data] == b[data]) return 0;
        if(a[data] < b[data]) return -1;
      })
    }
      sorted[data] = !sorted[data];
  }
}])
.controller('AdminTownsCtrl', ['RESTRequester', 'UserService',
  function(RESTRequester, UserService){
  var self = this,
      sorted = {id : false, username : false}
  self.towns = [];

  RESTRequester.Admin.getTowns('', UserService.user.access_token)
    .success(function(data) {
      self.towns = data.towns;
    })

  self.sortBy = function(data) {
    if(sorted[data]){
      self.towns.sort(function(a,b) {
        if(a[data] < b[data]) return 1;
        if(a[data] == b[data]) return 0;
        if(a[data] > b[data]) return -1;
      })
    } else {
      self.towns.sort(function(a,b) {
        if(a[data] > b[data]) return 1;
        if(a[data] == b[data]) return 0;
        if(a[data] < b[data]) return -1;
      })
    }
      sorted[data] = !sorted[data];
  }
}])