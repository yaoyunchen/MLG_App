var cMLGApp = angular.module('cMLGApp', ['ngRoute']);

cMLGApp.config(["$routeProvider", function($routeProvider){
  $routeProvider
  //Homepage
  .when('/', {
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
angular.module('cMLGApp').controller('loginController', ['$scope', function($scope) {

  $scope.pageClass = "page-login";
}]);

var cMLGApp = angular.module('cMLGApp');

cMLGApp.controller('mainController', ['$scope', '$location', function($scope, $location){
  $scope.pageClass = "page-home";

  $scope.$location = $location;
}]);
angular.module('cMLGApp').controller('signupController', ['$scope', function($scope) {
  $scope.pageClass = "page-signup";
  
  $scope.summoner = {};
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
        return $http.get('test.json')
          .then(function(res) {
            $timeout(function() {
              if (res.status == 200) {
                if (res.data === true) {
                  // Summoner registered in our database.
                  model.$setValidity('summonerRegistered', false);
                  console.log('true');
                } else if (res.data === false) {
                  // Summoner is not registered, check if the name entered is actual summoner name.
                  summonerExists();
                }
              } 
            }, 1000);
          }, function(res){
            // Unable to connect to users database to verify summoner name.
            model.$setValidity('connection', false);
          });
      };

      summonerExists = function() {
        var region = 'na';
        var name = scope.signupForm.signupName.$$rawModelValue;
        var url = '/search/' + region + '/' + name + '?callback=JSON_CALLBACK';

        return $http.get(url)
          .then(function(res) {
            // Connected to LoL API to confirm summoner actually exists.
            $timeout(function() {
              if (res.status == 200) {
                // Successful connection to routes and have data returned.  
                if (res.data.hasOwnProperty(name)) {
                  // If returned data contains a summoner's information.
                  scope.summoner.name = res.data[name].name;
                  scope.summoner.id = res.data[name].id;
                  scope.summoner.icon = res.data[name].profileIconId;

                  model.$setValidity('summonerExists', true);
                } else if (res.data.hasOwnProperty('status') && res.data.status.status_code == 404) {
                  // If returned data shows that the summoner is not found.
                  scope.summoner = {};

                  model.$setValidity('summonerExists', false);
                }
              }
            }, 1000);
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