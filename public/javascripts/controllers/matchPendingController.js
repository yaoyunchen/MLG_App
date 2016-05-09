angular.module('cMLGApp').controller('matchPendingController', ['$scope', '$rootScope', '$matchFactory', '$location', function($scope, $rootScope, $matchFactory, $location) {

  $scope.pageClass = "page-match-pending";

  var checkPoints = function(bet_points) {
    if (parseInt($rootScope.mlg_points) - parseInt(bet_points) < 0) {
      return false;
    } else {
      return true;
    }
  };

  $scope.data = $matchFactory.get($rootScope.user_id, function() {
    if($scope.data !== undefined){
      if($scope.data.value !== undefined){
        $scope.matchRequestList = $scope.data.value.data.rows;
      }
    }
    for (var i = 0; i < $scope.matchRequestList.length; i++) {
      $scope.matchRequestList[i].sufficientPoints = checkPoints(($scope.matchRequestList[i].bet));
    }
  });

  $scope.accept = function(request_id) {
    var data = $scope.data.value.data.rows;
    var acceptRequest;

    for (var i = 0; i < data.length; i++) {
      if (request_id == data[i].id) {
        acceptRequest = data[i];
        break;
      }
    }
      
    $matchFactory.acceptMatch(acceptRequest.match_id, request_id, $rootScope.user_id, parseInt($rootScope.mlg_points) - parseInt(acceptRequest.bet));

    $location.path('/users/user')
  };

  $scope.cancel = function(request_id) {
    console.log('denied!', request_id);
    // var data = $scope.data.value.data.rows;
    
    // for (var key in data) {
    //   if (!data.hasOwnProperty(key)) continue;
    //   var obj = data[key];
    // }
  };

}]);