var cMLGApp = angular.module('cMLGApp', ['ngRoute', 'ngAnimate']);

cMLGApp.config(["$routeProvider", function($routeProvider){
  $routeProvider
  // Homepage
  .when('/', {
  //   resolve: {
  //     "check": function($location, $rootScope){
  //       if (localStorage['username'] === 'undefined'){
  //         $location.path('/login');
  //       }
  //     }
  //   },
    templateUrl : 'home.ejs',
    controller  : 'mainController'
  })
  .when('/signup', {
    templateUrl : 'signup.ejs',
    controller  : 'signupController'
  })
  .when('/login', {
    templateUrl : 'login.ejs',
    controller  : 'loginController'
  });
}]);
angular.module('cMLGApp').controller('loginController', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {

  $scope.pageClass = "page-login";
  
  $scope.login = function(){
    console.log("submitted");
    //checks database for user

    if($scope.loginForm.$valid && $scope.username == "admin" && $scope.password == "admin"){
      $location.path('/');
      $rootScope.loggedIn = $scope.username;
      localStorage['username'] = $scope.username;
      console.log("Logged in as " + $rootScope.loggedIn);
    } else {
      alert('Wrong Stuff');
      $scope.loginForm.submitted = true;
      localStorage['username'] = undefined;
      $scope.username = "";
      $scope.password = "";
    }
  }
}]);

var cMLGApp = angular.module('cMLGApp');

cMLGApp.controller('mainController', ['$scope', '$location', function($scope, $location){
  $scope.pageClass = "page-home";

  $scope.$location = $location;

  //checks local storage for logged in
  var username = localStorage['username'];
  console.log("you are currently logged in as: " + username);
  if (username !== undefined){
    console.log("will set log in here");
  }

}]);
angular.module('cMLGApp').controller('signupController', ['$scope', function($scope) {
  $scope.pageClass = "page-signup";
  
  $scope.loading = false;
  $scope.hideInfoPane = true;
  $scope.hideImgPane = true;

  $scope.summoner = {};
  $scope.icons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  $scope.setIcon = -1;

  $scope.generateIcon = function() {
    if ($scope.setIcon == -1) {
      $scope.setIcon = $scope.icons[Math.floor(Math.random() * $scope.icons.length)];
    }
  };

  $scope.createUser = function() {
    console.log('User data should be verified and saved to database now.')

    $scope.generateIcon();
    $scope.hideImgPane = false;
  };

}]);

var cMLGApp = angular.module('cMLGApp');

cMLGApp.controller('summonerController', ['$scope', '$summoner', function($scope, $summoner) {

  // Value entered into the form input field when searching for a summoner.
  $scope.searchSummonerName = '';
  $scope.region = 'na';

  // All summoner data will be saved in summoner.
  $scope.summoner;

  $scope.summonerSearch = function(isValid) {
    if (isValid) {
      $scope.summoner = $summoner.get($scope.searchSummonerName, $scope.region, function() {
      })
    }
  }
}]);
var cMLGApp = angular.module('cMLGApp');

cMLGApp.directive('homepage', ['$location', function($location){
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'home.ejs', 
  }
}]);
var cMLGApp = angular.module('cMLGApp');

cMLGApp.directive('navbar', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: { },
    templateUrl: 'navbar.ejs'
  }
});
angular.module('cMLGApp').directive('signup', ["$timeout", "$q", "$http", function($timeout, $q, $http) {
  return {
    retrict: 'AE',
    require: 'ngModel',
    link: function(scope, elm, attr, model) {
      model.$asyncValidators.summonerRegistered = function() {
        scope.loading = true;

        return $http.get('test.json')
          .then(function(res) {
            if (res.status == 200) {
              if (res.data === true) {
                // Summoner registered in our database.
                scope.summoner = {};

                model.$setValidity('summonerRegistered', false);

                scope.hideImgPane = true;
                $timeout(function() {
                  scope.hideInfoPane = true;
                }, 250)
              } else if (res.data === false) {
                // Summoner is not registered, check if the name entered is actual summoner name.
                summonerExists();
              }
            }
          }, function(res){
            // Unable to connect to users database to verify summoner name.
            model.$setValidity('connection', false);
          }).finally(function() {
            scope.loading = false;
          });
      };

      summonerExists = function() {
        var region = 'na';
        var name = scope.signupForm.signupName.$$rawModelValue;
        var url = '/search/' + region + '/' + name + '?callback=JSON_CALLBACK';

        return $http.get(url)
          .then(function(res) {
            // Connected to LoL API to confirm summoner actually exists.
            if (res.status == 200) {
              // Successful connection to routes and have data returned.  
              if (res.data.hasOwnProperty(name)) {
                // If returned data contains a summoner's information.
                scope.summoner.name = res.data[name].name;
                scope.summoner.id = res.data[name].id;
                scope.summoner.icon = res.data[name].profileIconId;

                model.$setValidity('summonerExists', true);
                
                scope.hideInfoPane = false;
                
              } else if (res.data.hasOwnProperty('status') && res.data.status.status_code == 404) {
                // If returned data shows that the summoner is not found.
                scope.summoner = {};

                model.$setValidity('summonerExists', false);
                
                scope.hideImgPane = true;
                $timeout(function() {
                  scope.hideInfoPane = true;
                }, 250)
              }
            }
          }, function(res) {
            // Unable to connect to LoL API to verify summoner name.
            model.$setValidity('connection', false);
          });
      };
    }
  };
}]);

var cMLGApp = angular.module('cMLGApp');

const JSONCALLBACK = '?callback=JSON_CALLBACK';

cMLGApp.factory('$summoner', ['$http', '$q', function($http, $q) {

  return {
    get: function(summonerName, region, callback) {
      var deferred = $q.defer();
      var url = '/search/' + region + '/' + summonerName + JSONCALLBACK;
      var summoner = {};
      $http.get(url)
      .then(function(res) {
        
        if (res.status == 200) {
          var key = summonerName;
          for (key in res.data) {
            // Check if a 404 is returned.
            if (res.data.hasOwnProperty('status') == true) {
              if (res.data.status.hasOwnProperty('status_code')) {
                if (res.data.status.status_code == 404) {
                  break;
                }
              }
            }
            if (res.data.hasOwnProperty(key)) {
              deferred.resolve(summoner[key] = res.data[key]);
            }    
            if (callback) {
              callback();
            }
          }
        }
      });

      return deferred.promise.$$state;
    }
  };
}]);
$(function() {
  $("body").on("input propertychange", ".floating-label-form-group", function(e) {
    $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
  }).on("focus", ".floating-label-form-group", function() {
    $(this).addClass("floating-label-form-group-with-focus");
  }).on("blur", ".floating-label-form-group", function() {
    $(this).removeClass("floating-label-form-group-with-focus");
  });
});