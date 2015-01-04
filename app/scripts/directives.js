angular.module('Ads')
.directive('ad', [function(){
	return {
		scope: {
			data: '=',
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