var cMLGApp = angular.module('cMLGApp');

cMLGApp.directive('homepage', ['$location', function($location){
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'home.ejs', 
  }
}]);