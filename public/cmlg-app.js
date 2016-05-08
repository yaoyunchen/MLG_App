var cMLGApp = angular.module('cMLGApp', ['ngRoute', 'ngAnimate']);

const JSONCALLBACK = '?callback=JSON_CALLBACK';

cMLGApp.config(["$routeProvider", function($routeProvider) {
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
      "check": ["$location", "$rootScope", function($location, $rootScope){
        if (localStorage['username'] === 'undefined'){
          $location.path('/login');
        }
      }]
    },
    templateUrl : 'createMatch.ejs',
    controller  : 'createMatchController'
  })
  .when('/myMatch', {
    resolve: {
      "check": ["$location", "$rootScope", function($location, $rootScope){
        if (localStorage['username'] === 'undefined'){
          $location.path('/login');
        }
      }]
    },
    templateUrl : 'myMatch.ejs',
    controller  : 'myMatchController'
  });
}]);
angular.module('cMLGApp').controller('createMatchController', ['$scope', '$champions', '$matchFactory', '$location', function($scope, $champions, $matchFactory, $location) {
  $scope.pageClass = "page-createMatch";
  $scope.betType = "closeTrue";
  
  $scope.min = function() {
    $scope.bet = 100;
    console.log($scope.bet);
  }

  $scope.max = function() {
    $scope.bet = 1000;
    console.log($scope.bet);
  }

  $scope.loading = false;
  $scope.userExists;
  $scope.user_id = {};
  $scope.summoner = {};
  $scope.matchType = 1;

  $scope.submittedChampion = false;
  $scope.championList = {};
  $scope.championExists;
  $scope.selectedChampion = {
    id : {},
    key : {},
    name : {},
    title : {},
    image : {}
  };

  $scope.browseChamps = false;


  $scope.championData = $champions.get();

  $scope.validChampion = function() {
    $scope.submittedChampion = true;
    $scope.championList = $scope.championData.value.data.data;
    for (var champ in $scope.championList) {
      // skip loop if the property is from prototype
      if (!$scope.championList.hasOwnProperty(champ)) continue;
      var originalName = $scope.championList[champ].name;
      var normName = originalName.toLowerCase().replace(' ','').replace('\'','');
      var normChampion = $scope.champion.toLowerCase().replace(' ','').replace('\'','');
      if (normName === normChampion){
        $scope.championExists = true;
        $scope.selectedChampion = {
          id : $scope.championList[champ].id,
          key : $scope.championList[champ].key,
          name : $scope.championList[champ].name,
          title : $scope.championList[champ].title,
          image : $scope.championList[champ].image.full
        };
        console.log($scope.selectedChampion);
        break;
      } else {
        $scope.championExists = false;
        $scope.selectedChampion = {};
      }
    }
  }
  $scope.createMatchRequest = function() {
    $matchFactory.post(localStorage['user_id'], $scope.selectedChampion.id, $scope.bet, $scope.betType, $scope.matchType);
    $matchFactory.post($scope.user_id, $scope.selectedChampion.id, $scope.bet, $scope.betType, $scope.matchType);
    $location.path('/');
  }

  $scope.setBrowseChamps = function() {
    $scope.browseChamps = true;
  }

  $scope.back = function() {
    $location.path('/');
  }

  $scope.selectChamp = function(name) {
    $scope.champion = name;
    console.log(name);
    $scope.browseChamps = false;
    $scope.validChampion();
  }

}]);

angular.module('cMLGApp').controller('loginController', ['$scope', '$location', '$users', function($scope, $location, $users) {

  $scope.pageClass = "page-login";
  
  $scope.data = {
    value : {
      username : "",
      email : "" ,
      password : "" 
    }
  };

  $scope.validLogin = function() {
    $scope.data = $users.get($scope.email.toLowerCase(), $scope.password, $scope.displayUser());
  };

  $scope.displayUser = function() {
    
    $scope.$watch(function(){
      console.log($scope.data.value);
      if($scope.data.value.hasOwnProperty('username') === true){
        $location.path('/');
        localStorage['username'] = $scope.data.value.username;
        localStorage['user_id'] = $scope.data.value.id;
        console.log("Logged in as " + $scope.loggedIn);
      } else if ($scope.data.value === 'error') {
        $scope.loginForm.submitted = true;
        localStorage['username'] = undefined;
        localStorage['user_id'] = undefined;

      }
    }, true);
  }

  // $scope.login = function(){
   




  //   // if($scope.loginForm.$valid && $scope.username == "admin" && $scope.password == "admin"){
  //   //   $location.path('/');
  //   //   $scope.loggedIn = $scope.username;
  //   //   localStorage['username'] = $scope.username;
  //   //   console.log("Logged in as " + $scope.loggedIn);
  //   // } else {
  //   //   alert('Wrong Stuff');
  //   //   $scope.loginForm.submitted = true;
  //   //   localStorage['username'] = undefined;
  //   //   $scope.username = "";
  //   //   $scope.password = "";
  //   // }
  // }
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
angular.module('cMLGApp').controller('myMatchController', ['$scope', function($scope) {
  $scope.pageClass = "page-myMatch";
        // Configuration settings for the graph.
      $scope.config = {
        title: 'title',
        tooltips: true,
        labels: true,
        isAnimate: true
      };

      // Data for the graph.
      $scope.data = {
        series: ['a','b','c','d'],
        data: [1,2,3,4]
      };
}]);

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
angular.module('cMLGApp').directive('appendIcon',["$timeout", "$q", "$http", "$compile", function($timeout, $q, $http, $compile) {
  return {
    restrict: 'A',
    link: function(scope, elem, attr, createMatchController) {
      // Sets all tabs as inactive when they begin.
      $timeout(function() {
        scope.selectChamp;
        var ListOfChamp = scope.championData.value.data.data;
        for (var champ in ListOfChamp) {
          var url = 'http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/' + ListOfChamp[champ].image.full;
          var thisDiv = angular.element(document).find('#appendIcon');
          var template = "<div class='selectChamp'><img class='img-signup-icon selectChampIcon' ng-src='"+url+"' ng-click=\"selectChamp('"+ListOfChamp[champ].key+"')\"/></div>";
          var linkFn = $compile(template);
          var content = linkFn(scope);

          thisDiv.append(content);
        }
      }, 1000);
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
        return $http.get('/db/search/users/' + scope.signupForm.signupName.$$rawModelValue + JSONCALLBACK, {timeout: 5000})
          .then(function(res) {
            if (res.status == 200) {
              if (res.data.rowCount != 0) {
                // Summoner registered in our database.
                scope.summoner = {};

                scope.userExists = true;
                scope.summonerExists = true;
                scope.hideImgPane = true;
                scope.setIcon = -1;
                scope.user_id = res.data.rows[0].id;

                $timeout(function() {
                  scope.hideInfoPane = true;
                }, 200)
              } else {
                // Summoner is not registered, check if the name entered is actual summoner name.
                scope.userExists = false;
                summonerExists();
                console.log('user not registered');
                console.log(res.data);
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
                scope.summonerExists = true;

                model.$setValidity('summonerExists', true);
                
                scope.hideInfoPane = false;
                
              } else if (res.data.hasOwnProperty('status') && res.data.status.status_code == 404) {
                // If returned data shows that the summoner is not found.
                scope.summoner = {};
                scope.summonerExists = false;
                model.$setValidity('summonerExists', false);
                
                scope.hideImgPane = true;
                scope.setIcon = -1;

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

cMLGApp.factory('$champions', ['$http', '$q', function($http, $q) {

  return {
    get: function(callback) {
      var deferred = $q.defer();

      var url = '/search/allchampions?callback=JSON_CALLBACK';

      $http.get(url).then(function(res) {
        // success.
        deferred.resolve(res);

      }).then(function(res) {
        // fail.
      }).finally(function() {
        // do this regardless of success/fail.
      })
      return deferred.promise.$$state;
    }
  };
}]);
var cMLGApp = angular.module('cMLGApp');

cMLGApp.factory('$matchFactory', ['$http', '$q', function($http, $q) {

  return {
    post: function(username, champion, bet, betType, matchType) {
      var url = '/db/post/match_request/'+username+'/'+champion+'/'+bet+'/'+betType+'/'+matchType;
      $http.post(url).then(function(res) {
        //success
      }).then(function(res) {
        // fail.
        deferred.resolve(res);
      }).finally(function() {
        // do this regardless of success/fail.
      })
    }
  };
}]);
var cMLGApp = angular.module('cMLGApp');



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
var cMLGApp = angular.module('cMLGApp');

cMLGApp.factory('$users', ['$http', '$q', function($http, $q) {

  return {
    get: function(email, password, callback) {
      var deferred = $q.defer();

      var url = '/db/search/users/login/' + email + '/' + password + JSONCALLBACK;

      $http.get(url).then(function(res) {
        // success.
        console.log(res.data);
        if(res.data.hasOwnProperty('username') === true){
          if(password === res.data.password){
            deferred.resolve(res.data);
          }
        } else {
          deferred.resolve('error');
        }

        if (callback) {
          callback;
        }
        
      }).then(function(res) {
        // fail.
        deferred.resolve(res);
      }).finally(function() {
        // do this regardless of success/fail.
      })
      return deferred.promise.$$state;
    },

    checkUsername: function(username) {
      var deferred = $q.defer();

      var url = '/db/search/users/' + username + JSONCALLBACK;
      $http.get(url).then(function(res) {
        // success.

        deferred.resolve(res)
        if (callback) {
          callback;
        }
      }).then(function(res) {
        // fail.
      }).finally(function() {
        // do this regardless of success/fail.
      })

      return deferred.promise.$$state;
    }, 

    saveUser: function(data) {
      var url = '/db/post/user/' + data + JSONCALLBACK;
      $http.post(url).then(function(res) {
        // success
        return res;
      })
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