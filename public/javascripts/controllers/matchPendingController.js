angular.module('cMLGApp').controller('matchPendingController', ['$scope', '$location', '$users', '$matchFactory', '$timeout', function($scope, $location, $users, $matchFactory, $timeout) {

  $scope.pageClass = "page-match-pending";

  $scope.showMatchRequests = function() {
    $timeout(function(){
      if($scope.data !== undefined){
        if($scope.data.value != undefined){
          $scope.matchRequestList = $scope.data.value.data.rows
          console.log($scope.data.value.data.rows);
        }
      }
    }, 200);

  }

  $scope.data = $matchFactory.get(localStorage['user_id'], $scope.showMatchRequests());

  $scope.accept = function(request_id) {
    console.log(request_id);
    var data = $scope.data.value.data.rows;
    
    for (var key in data) {
      if (!data.hasOwnProperty(key)) continue;
      var obj = data[key];
      console.log(obj);
    }

  };

  $scope.cancel = function(request_id) {
    console.log(request_id);
    var data = $scope.data.value.data.rows;
    
    for (var key in data) {
      if (!data.hasOwnProperty(key)) continue;
      var obj = data[key];
      console.log(obj);
    }
  };

}]);