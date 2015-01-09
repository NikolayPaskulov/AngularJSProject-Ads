angular.module('Ads')
.directive('ad', [function(){
	return {
		scope: {
			data: '='
		},
		replace: true,
		restrict: 'AE',
		templateUrl: 'directives/ad.html',
		link: function($scope, $element, $attrs) {
			$scope.isoToDate = function(str) {
        		var d = new Date(str).toDateString().split(' ').slice(1);
       			 return  d[1] + '-' + d[0] + '-' + d[2];
			};
		}
	};
}])
.directive('userad', [function(){
	return {
		scope: {
			data: '=',
			deactivate : '&',
			publish : '&'
		},
		replace: true,
		restrict: 'AE',
		templateUrl: 'directives/userAd.html',
		link: function(scope, element, attrs) {
			scope.isoToDate = function(str) {
        		var d = new Date(str).toDateString().split(' ').slice(1);
       			 return  d[1] + '-' + d[0] + '-' + d[2];
			},
			scope.deactivateBtn = function(id) {
				scope.deactivate({id : id})
			},
			scope.publishAgainBtn = function(id) {
				scope.publish({id: id});
			}
		}
	};
}])
.directive('pager', ['RESTRequester', function(RESTRequester){
	return {
		scope: {
			numPage: '@',
			change: '&'
		},
		replace: true,
		restrict: 'E',
		templateUrl: 'directives/pager.html',
		link: function(scope, element, attrs) {

		}
	};
}]);