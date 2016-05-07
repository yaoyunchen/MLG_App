angular.module('cMLGApp').controller('signupController', ['$scope', '$users', '$location', function($scope, $users, $location) {
  $scope.pageClass = "page-signup";
  
  $scope.loading = false;
  $scope.hideInfoPane = true;
  $scope.hideImgPane = true;

  $scope.userExists;
  $scope.summonerExists;

  $scope.summoner = {};
  $scope.icons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  $scope.setIcon = -1;

  $scope.go = function(path) {
    $location.path(path);
  }

  var reset = function() {
    $scope.hideInfoPane = true;
    $scope.userExists = undefined;
    $scope.summonerExists = undefined;
    $scope.signupName = undefined;
    $scope.summoner = {};
  }

  var validations = function() {

    var errors = [];
    if ($scope.errorMsgs != undefined) {
      errors = $scope.errorMsgs;
    }

    // Summoner name changes.
    var error = 'Entered summoner name changed!  Please re-enter the summoner name.';
    var index = errors.indexOf(error);
    if(index !== -1) {
      errors.splice(index, 1);
    }
    if ($scope.summoner.name.toLowerCase() != $scope.signupName || $scope.signupName == '') {
      reset();
      errors.push(error);
    }
    
    // Email validation.
    var re = /\S+@\S+\.\S+/;
    error = 'Email format incorrect.';
    var index = errors.indexOf(error);
    if(index !== -1) {
      errors.splice(index, 1);
    }
    if ($scope.signupEmail === undefined || $scope.signupEmail === '' || re.test($scope.signupEmail) === false) {
      errors.push(error)
    }
    
    // Password validation.
    error = 'Password needs to be at least 6 characters.';
    var index = errors.indexOf(error);
    if(index !== -1) {
      errors.splice(index, 1);
    }
    if ($scope.signupPass === undefined || $scope.signupPass.length < 6) {
      errors.push(error)
    }

    return errors;
  }


  $scope.createUser = function() {

    var errors = validations();
    if (errors.length == 0) {

      $scope.generateIcon();
      
      var data = "'" + $scope.summoner.name.toLowerCase() + "', '" + $scope.signupEmail.toLowerCase() + "', " + $scope.summoner.icon + ", '" + $scope.signupPass + "', " + $scope.summoner.id + ", " + $scope.setIcon + ", false, 10000, 0, true, '[]'";
      

      $users.saveUser(data);
      $scope.hideImgPane = false;
      $scope.lockCreate = true;

    } else {
      $scope.errorMsgs = errors;
    }
  };
  
  $scope.generateIcon = function() {
    if ($scope.setIcon == -1) {
      $scope.setIcon = $scope.icons[Math.floor(Math.random() * $scope.icons.length)];
      if ($scope.setIcon == $scope.summoner.icon) {
        $scope.setIcon = -1;
        $scope.generateIcon();
      }
    }
  };

}]);
