angular.module('cMLGApp').controller('signupController', ['$scope', '$users', '$location', function($scope, $users, $location) {
  $scope.pageClass = "page-signup";
  
  $scope.loading = false;
  $scope.hideInfoPane = true;
  $scope.hideImgPane = true;

  $scope.userExists;
  $scope.summonerExists;
  $scope.emailExists;

  $scope.summoner = {};
  $scope.icons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  $scope.setIcon;

  $scope.go = function(path) {
    $location.path(path);
  };

  var reset = function() {
    $scope.hideInfoPane = true;
    $scope.userExists = undefined;
    $scope.summonerExists = undefined;
    $scope.signupName = undefined;
    $scope.summoner = {};
  };

  var resetError = function(errors, error) {
    var index = errors.indexOf(error);
    if(index !== -1) {
      errors.splice(index, 1);
    }
    return errors;
  };

  var validateSummoner = function(errors) {
    var error = 'Entered summoner name changed!  Please re-enter the summoner name.';
    errors = resetError(errors, error);
    if ($scope.summoner.name.toLowerCase() !== $scope.signupName || $scope.signupName === '') {
      reset();
      errors.push(error);
    }
    return errors;
  };

  var validateEmail = function(errors) {
    var re = /\S+@\S+\.\S+/;
    var error = 'Email format incorrect.';
    errors = resetError(errors, error);
    errors = resetError(errors, 'Email already registered.');
    
    if ($scope.signupEmail === undefined || $scope.signupEmail === '' || re.test($scope.signupEmail) === false) {
      errors.push(error);
    } else {
      error = 'Email already registered.';
      $scope.email = $users.checkEmail($scope.signupEmail, function() {
        if ($scope.email.hasOwnProperty('status') && $scope.email.status == 1) {
          if ($scope.email.value.data.rowCount == 1) {
            errors.push(error);
          }
        } 
      });
    }
    return errors;
  };

  var validatePass = function(errors) {
    var error = 'Password needs to be at least 6 characters.';
    errors = resetError(errors, error);
    if ($scope.signupPass === undefined || $scope.signupPass.length < 6) {
      errors.push(error);
    }
    return errors;
  };


  var validations = function() {
    var errors = [];
    if ($scope.errorMsgs !== undefined) {
      errors = $scope.errorMsgs;
    }
    errors = validateSummoner(errors);
    errors = validateEmail(errors);
    errors = validatePass(errors)
    return errors;
  };

  $scope.createUser = function() {

    var errors = validations();
    if (errors.length === 0) {

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
    if ($scope.setIcon === undefined) {
      $scope.setIcon = $scope.icons[Math.floor(Math.random() * $scope.icons.length)];
      if ($scope.setIcon == $scope.summoner.icon) {
        $scope.setIcon = undefined;
        $scope.generateIcon();
      }
    }
  };

}]);
