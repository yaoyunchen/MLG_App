var cMLGApp = angular.module('cMLGApp', ['ngRoute', 'ngAnimate']);

const JSONCALLBACK = '?callback=JSON_CALLBACK';

cMLGApp.run(function($rootScope) {
  $rootScope.username;
  $rootScope.user_id;
  $rootScope.loggedIn;
  $rootScope.updateUser = function() {
    $rootScope.username = localStorage['username'];
    $rootScope.user_id = localStorage['user_id'];
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
    templateUrl   : 'home.ejs',
    controller    : 'mainController'
  })
  .when('/signup', {
    templateUrl   : 'signup.ejs',
    controller    : 'signupController'
  })
  .when('/login', {
    templateUrl : 'login.ejs',
    controller  : 'loginController'
  })
  .when('/createMatch', {
    resolve: {
      "check": function($location, $rootScope){
        if (localStorage['username'] === 'undefined'){
          $location.path('/login');
        }
      }
    },
    templateUrl : 'createMatch.ejs',
    controller  : 'createMatchController'
  })
  .when('/myMatch', {
    resolve: {
      "check": function($location, $rootScope){
        if (localStorage['username'] === 'undefined'){
          $location.path('/login');
        }
      }
    },
    templateUrl : 'myMatch.ejs',
    controller  : 'myMatchController'
  });
});