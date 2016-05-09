var cMLGApp = angular.module('cMLGApp', ['ngRoute', 'ngAnimate', 'ngDialog', 'angularCharts']);

const JSONCALLBACK = '?callback=JSON_CALLBACK';

cMLGApp.run(function($rootScope) {
  $rootScope.username;
  $rootScope.user_id;
  $rootScope.mlg_points;
  $rootScope.loggedIn;
  $rootScope.updateUser = function() {
    localStorage['username'];
    localStorage['user_id'];
    localStorage['mlg_points'];
    
    $rootScope.username = localStorage['username'];
    $rootScope.user_id = localStorage['user_id'];
    $rootScope.mlg_points = localStorage['mlg_points'];

    if ($rootScope.username === 'undefined' || $rootScope.username == '' || $rootScope.user_id === 'undefined' || $rootScope.user_id == '') {
      $rootScope.loggedIn = false;
    } else {
      $rootScope.loggedIn = true;
    }
  }
});

cMLGApp.config(function($routeProvider) {
  $routeProvider
  //Homepage
  .when('/', {
    resolve: {
      "check": function($location, $rootScope){
        $rootScope.updateUser();
      }
    },
    templateUrl   : 'home.ejs',
    controller    : 'mainController'
  })
  .when('/signup', {
    resolve: {
      "check": function($location, $rootScope){
        $rootScope.updateUser();
      }
    },
    templateUrl   : 'users/signup.ejs',
    controller    : 'signupController'
  })
  .when('/login', {
    resolve: {
      "check": function($location, $rootScope){
        $rootScope.updateUser();
      }
    },
    templateUrl : 'users/login.ejs',
    controller  : 'loginController'
  })
  .when('/match/create', {
    resolve: {
      "check": function($location, $rootScope){
        $rootScope.updateUser();
        if ($rootScope.username === undefined || $rootScope.username === 'undefined'){
          $location.path('/login');
        }
      }
    },
    templateUrl : 'match/create.ejs',
    controller  : 'matchCreateController'
  })
  .when('/match/pending', {
    resolve: {
      "check": function($location, $rootScope){
        $rootScope.updateUser();
        if ($rootScope.username === undefined || $rootScope.username === 'undefined'){
          $location.path('/login');
        }
      }
    },
    templateUrl : 'match/pending.ejs',
    controller  : 'matchPendingController'
  })
  .when('/users/user', {
    resolve: {
      "check": function($location, $rootScope){
        $rootScope.updateUser();
        if ($rootScope.username === undefined || $rootScope.username === 'undefined'){
          $location.path('/login');
        }
      }
    },
    templateUrl : 'users/user.ejs',
    controller  : 'userController'
  });
});