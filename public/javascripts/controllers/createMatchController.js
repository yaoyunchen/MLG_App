angular.module('cMLGApp').controller('createMatchController', ['$scope', '$location', function($scope, $location) {
  $scope.pageClass = "page-createMatch";
  $scope.betType = "closeTrue";
  
  $scope.min = function() {
    $scope.bet = 100;
    console.log($scope.bet);
  }

  $scope.min = function() {
    $scope.bet = 1000;
    console.log($scope.bet);
  }

}]);
