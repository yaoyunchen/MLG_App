angular.module('cMLGApp').controller('matchPendingController', ['$scope', '$location', '$users', '$matchFactory', '$timeout', function($scope, $location, $users, $matchFactory, $timeout) {

  $scope.pageClass = "page-match-pending";

  $scope.showMatchRequests = function() {
    $timeout(function(){
      if($scope.data !== undefined){
        if($scope.data.value != undefined){
          $scope.matchRequestList = $scope.data.value.data.rows
        }
      }
    }, 200);

  }

  $scope.data = $matchFactory.get(localStorage['user_id'], $scope.showMatchRequests());

  console.log(localStorage['user_id']);
}]);