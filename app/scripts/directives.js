angular.module('Ads')
.directive('ad', [function(){
	return {
		scope: {
			data: '=',
		},
		replace: true,
		restrict: 'AE',
		templateUrl: 'directives/ad.html'
	};
}]);