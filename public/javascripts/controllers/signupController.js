angular.module('cMLGApp').controller('signupController', ['$scope', '$users', function($scope, $users) {
  $scope.pageClass = "page-signup";
  
  $scope.loading = false;
  $scope.hideInfoPane = true;
  $scope.hideImgPane = true;

  $scope.userExists
  $scope.summoner = {};
  $scope.icons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  $scope.setIcon = -1;

  $scope.createUser = function() {
    console.log('User data should be verified and saved to database now.')

    $scope.generateIcon();
    $scope.hideImgPane = false;
  };
  
  $scope.generateIcon = function() {
    if ($scope.setIcon == -1) {
      $scope.setIcon = $scope.icons[Math.floor(Math.random() * $scope.icons.length)];
    }
  };

}]);
