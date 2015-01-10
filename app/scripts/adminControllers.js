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
        for (var i = 1; i <= num; i++) {
          self.pages.push(i)
        }
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