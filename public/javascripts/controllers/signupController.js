angular.module('cMLGApp').controller('signupController', ['$scope', function($scope) {
  $scope.pageClass = "page-signup";
  $scope.summoner = {};
  $scope.loading = false;
  $scope.hideInfoPane = true;
}]);
