var cMLGApp = angular.module('cMLGApp', ['ngRoute', 'ngAnimate']);

const JSONCALLBACK = '?callback=JSON_CALLBACK';

cMLGApp.run(["$rootScope", function($rootScope) {
  $rootScope.username;
  $rootScope.user_id;
  $rootScope.loggedIn;
  $rootScope.updateUser = function() {
    localStorage['username'];
    localStorage['user_id'];
    $rootScope.username = localStorage['username'];
    $rootScope.user_id = localStorage['user_id'];
    if ($rootScope.username === 'undefined' || $rootScope.username == '' || $rootScope.user_id === 'undefined' || $rootScope.user_id == '') {
      $rootScope.loggedIn = false;
    } else {
      $rootScope.loggedIn = true;
    }
  }
}]);

cMLGApp.config(["$routeProvider", function($routeProvider) {
  $routeProvider
  //Homepage
  .when('/', {
    resolve: {
      "check": ["$location", "$rootScope", function($location, $rootScope){
        $rootScope.updateUser();
      }]
    },
    templateUrl   : 'home.ejs',
    controller    : 'mainController'
  })
  .when('/signup', {
    resolve: {
      "check": ["$location", "$rootScope", function($location, $rootScope){
        $rootScope.updateUser();
      }]
    },
    templateUrl   : 'signup.ejs',
    controller    : 'signupController'
  })
  .when('/login', {
    resolve: {
      "check": ["$location", "$rootScope", function($location, $rootScope){
        $rootScope.updateUser();
      }]
    },
    templateUrl : 'login.ejs',
    controller  : 'loginController'
  })
  .when('/match/create', {
    resolve: {
      "check": ["$location", "$rootScope", function($location, $rootScope){
        $rootScope.updateUser();
        if ($rootScope.username === undefined || $rootScope.username === 'undefined'){
          $location.path('/login');
        }
      }]
    },
    templateUrl : 'match/create.ejs',
    controller  : 'matchCreateController'
  })
  .when('/match/pending', {
    // resolve: {
    //   "check": function($location, $rootScope){
    //     if ($rootScope.username === undefined || $rootScope.username === 'undefined'){
    //       $location.path('/login');
    //     }
    //   }
    // },
    templateUrl : 'match/pending.ejs',
    controller  : 'matchPendingController'
  })
  .when('/user/', {
    resolve: {
      "check": ["$location", "$rootScope", function($location, $rootScope){
        $rootScope.updateUser();
        if ($rootScope.username === undefined || $rootScope.username === 'undefined'){
          $location.path('/login');
        }
      }]
    },
    templateUrl : 'user/user.ejs',
    controller  : 'userController'
  });
}]);
angular.module('cMLGApp').controller('loginController', ['$scope', '$rootScope', '$location', '$users', '$q', function($scope, $rootScope, $location, $users, $q) {

  $scope.pageClass = "page-login";
  
  $scope.data = {
    value : {
      username : "",
      email : "" ,
      password : "" 
    }
  };
  $scope.errorMsg;

  $scope.updateUser = function() {
    $rootScope.$watch('loggedIn', function() {
      $scope.username = $rootScope.username;
      $scope.user_id = $rootScope.user_id;
      $scope.loggedIn = $rootScope.loggedIn;
    }) 
  }
 
  $scope.validLogin = function() {
    $scope.data = $users.get($scope.email.toLowerCase(), $scope.password, function() {
      $scope.$watch('data', function() {
        if ($scope.data.hasOwnProperty('value') ) {
          if ($scope.data.value.hasOwnProperty('error')) {
            $scope.errorMsg = $scope.data.value.error;
          } else {
            localStorage['username'] = $scope.data.value.username;
            localStorage['user_id'] = $scope.data.value.user_id;
            $rootScope.updateUser();
            $location.path('/');
          }
        }
      }, true);
    })
  };
}]);

var cMLGApp = angular.module('cMLGApp');

cMLGApp.controller('mainController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.pageClass = "page-home";

  $scope.$location = $location;

  $scope.updateUser = function() {
    // $rootScope.updateUser();
    $rootScope.$watch('loggedIn', function() {
      $scope.username = $rootScope.username;
      $scope.user_id = $rootScope.user_id;
      $scope.loggedIn = $rootScope.loggedIn;
    }) 
  }
  $scope.updateUser();

  $scope.userLoggedIn = function() {
    var status = true;
    if ($rootScope.username === undefined || $rootScope.username == '') {
      status = false;
    }
    return status;
  }
  $scope.userLoggedIn();

  $scope.logout = function() {
    localStorage['username'] = undefined;
    localStorage['user_id'] = undefined;
    $rootScope.updateUser();
    // $scope.updateUser();
    $location.path('/');
  }


}]);
angular.module('cMLGApp').controller('matchCreateController', ['$scope', '$champions', '$matchFactory', '$location', '$users', '$masteryFactory', function($scope, $champions, $matchFactory, $location, $users, $masteryFactory) {
  $scope.pageClass = "page-createMatch";
  $scope.betType = "closeTrue";
  
  $scope.min = function() {
    $scope.bet = 100;
  }

  $scope.max = function() {
    $scope.bet = 1000;
  }
  $scope.userData = {};
  $scope.opponentData = {};

  $scope.loading = false;
  $scope.userExists;
  $scope.matchType = 1;
  $scope.tournament_id = 0;
  $scope.user_likes = 0;
  $scope.opponent_likes = 0;

  $scope.submittedChampion = false;
  $scope.championList = {};
  $scope.championExists;
  $scope.selectedChampion = {
    id : {},
    key : 'Teemo',
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
    //creating match requests
    //$matchFactory.post(localStorage['user_id'], $scope.selectedChampion.id, $scope.selectedChampion.key, $scope.bet, $scope.betType, $scope.matchType);
    //$matchFactory.post($scope.user_id, $scope.selectedChampion.id, $scope.selectedChampion.key, $scope.bet, $scope.betType, $scope.matchType);
    
    //creating match
    
    (function(username,callback) {
      $scope.userData = $users.checkUsername(localStorage['username'], function() {
        var my_id = $scope.userData.value.data.rows[0].summoner_id;
        $scope.user_points = $masteryFactory.getChampion('na', my_id, $scope.selectedChampion.id);
        //$scope.user_last_game_id;

      });

      $scope.opponentData = $users.checkUsername($scope.matchInviteForm.summonerName.$$rawModelValue, function(){
        var opponent_id = $scope.opponentData.value.data.rows[0].summoner_id;
        //$scope.opponent_points = $masteryFactory.getChampion('na', opponent_id, $scope.selectedChampion.id);
        //scope.opponent_last_game_id;

      });
        
    })();    


    // var createMatch_str = ""+localStorage['user_id']+"/"
    // +$scope.tournament_id+"/"+
    // +$scope.user_points+"/"
    // + 0 +"/"
    // +$scope.user_last_game_id+"/"
    // +$scope.opponent_points+"/"
    // + 0 +"/"
    // +$scope.opponent_last_game_id+"/"
    // +$scope.user_likes+"/"
    // +$scope.opponent_likes+"/"
    // + 1 +"/"
    // +$scope.bet*2;
    
    // $matchFactory.createMatch(createMatch_str);
    // $location.path('/');
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
angular.module('cMLGApp').controller('userController', ['$scope', function($scope) {
  $scope.pageClass = "page-user";
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
angular.module('cMLGApp').directive('createMatch', ["$timeout", "$q", "$http", function($timeout, $q, $http) {
  return {
    retrict: 'AE',
    require: 'ngModel',
    link: function(scope, elm, attr, model) {
      model.$asyncValidators.summonerRegistered = function() {
        scope.loading = true;
      return $http.get('/db/search/users/' + scope.matchInviteForm.summonerName.$$rawModelValue + JSONCALLBACK, {timeout: 5000})
        .then(function(res) {
          if (res.status == 200) {
            if (res.data.rowCount != 0) {
              // Summoner registered in our database.
              scope.userExists = true;
              // scope.user_id = res.data.rows[0].id;
            } else {
              // Summoner is not registered, check if the name entered is actual summoner name.
              scope.userExists = false;

              console.log('user not registered');
            }
          }
        }, function(res){
          // Unable to connect to users database to verify summoner name.
          model.$setValidity('connection', false);
        }).finally(function() {
          scope.loading = false;
        });
      };
    }
  };
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
                scope.setIcon = undefined;
                scope.user_id = res.data.rows[0].id;

                $timeout(function() {
                  scope.hideInfoPane = true;
                }, 200)
              } else {
                // Summoner is not registered, check if the name entered is actual summoner name.
                scope.userExists = false;
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
                scope.summonerExists = true;

                model.$setValidity('summonerExists', true);
                
                scope.hideInfoPane = false;
                
              } else if (res.data.hasOwnProperty('status') && res.data.status.status_code == 404) {
                // If returned data shows that the summoner is not found.
                scope.summoner = {};
                scope.summonerExists = false;
                model.$setValidity('summonerExists', false);
                
                scope.hideImgPane = true;
                scope.setIcon = undefined;

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

cMLGApp.factory('$masteryFactory', ['$http', '$q', function($http, $q) {

  return {
    getChampion: function(region, summonerID, championID, callback) {
      var deferred = $q.defer();

      var url = '/search/'+region+'/'+summonerID+'/champmasteries/'+championID+'?callback=JSON_CALLBACK';

      $http.get(url).then(function(res) {
        // success.
        deferred.resolve(res);
      }).then(function(res) {
        // fail.
      }).finally(function() {
        // do this regardless of success/fail.
      });
      return deferred.promise.$$state;
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
    //create match request
    post: function(username, champion_id, champion_key, bet, betType, matchType) {
      var url = '/db/post/match_request/'+username+'/'+champion_id+'/'+champion_key+'/'+bet+'/'+betType+'/'+matchType;
      $http.post(url).then(function(res) {
        //success
      }).then(function(res) {
        // fail.
        deferred.resolve(res);
      }).finally(function() {
        // do this regardless of success/fail.
      })
    },
    //create match
    createMatch: function(user_id, tournament_id, user_points, user_total_games_played, user_last_game_id, opponent_points, opponent_total_games_played, opponent_last_game_id, user_likes, opponent_likes, status, pot, end_time) {
      var url = '/db/post/match_request/';
      $http.post(url).then(function(res) {
        //success
      }).then(function(res) {
        // fail.
        deferred.resolve(res);
      }).finally(function() {
        // do this regardless of success/fail.
      })
    },
    //get all active match requests
    get: function(user_id, callback) {
      var deferred = $q.defer();
      var url = '/db/get/match_request/active/' + user_id + '?callback=JSON_CALLBACK';
      $http.get(url).then(function(res) {
        //success
        var data = {};
        var result = res.data.rows;
        for (var key in result) {
          if (!result.hasOwnProperty(key)) continue;
          var obj = result[key];
          //getting champion image url
          obj.image = 'http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/'+obj.champion_key+'.png'
          //converting status int into str
          if(obj.status === 1){
            obj.status_str = 'Pending';
          } else if(obj.status === 2){
            obj.status_str = 'Waiting for Other Player';
          }
          //converting bet type int into str
          if(obj.bettype === 0){
            obj.bettype_str = 'Close Match';
          } else if(obj.bettype === 1){
            obj.bettype_str = 'Big Win';
          }
        };

        deferred.resolve(res);
      })

      if (callback) {
        callback();
      }
      return deferred.promise.$$state;
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

cMLGApp.factory('$users', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {

  return {
    get: function(email, password, callback) {
      var deferred = $q.defer();

      var url = '/db/search/users/login/' + email + '/' + password + JSONCALLBACK;

      $http.get(url).then(function(res) {
        // success.
        if (res.data === undefined || res.data == '') {
          deferred.resolve({error: 'Email not registered.'});
        } else if (res.data != undefined && res.data != '') {
          if (password === res.data.password) {
            var user = {
              username: res.data.username, 
              user_id: res.data.id
            }
            deferred.resolve(user)
          } else {
            deferred.resolve({error: 'Incorrect password.'});
          }
        }
      })

      if (callback) {
        callback();
      }

      return deferred.promise.$$state;
    },

    checkUsername: function(username,callback) {
      var deferred = $q.defer();

      var url = '/db/search/users/' + username + JSONCALLBACK;
      $http.get(url).then(function(res) {
        deferred.resolve(res)
        if(callback){
          callback();
        }
      })

      return deferred.promise.$$state;
    }, 

    checkEmail: function(email, callback) {
      var deferred = $q.defer();
      var url = '/db/search/users/email/' + email + JSONCALLBACK;
      $http.get(url).then(function(res) {
        deferred.resolve(res)
        if (callback) {
          callback();
        }
      })

      return deferred.promise.$$state;
    },

    saveUser: function(data) {
      var url = '/db/post/user/' + data + JSONCALLBACK;
      $http.post(url).then(function(res) {
        // success
        if (res.data.hasOwnProperty('rows')) {
          localStorage['username'] = res.data.rows[0].username;
          localStorage['user_id'] = res.data.rows[0].id;
        }
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