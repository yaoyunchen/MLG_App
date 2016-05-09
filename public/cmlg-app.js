var cMLGApp = angular.module('cMLGApp', ['ngRoute', 'ngAnimate', 'ngDialog', 'angularCharts']);

const JSONCALLBACK = '?callback=JSON_CALLBACK';

cMLGApp.run(["$rootScope", function($rootScope) {
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
    resolve: {
      "check": ["$location", "$rootScope", function($location, $rootScope){
        if ($rootScope.username === undefined || $rootScope.username === 'undefined'){
          $location.path('/login');
        }
      }]
    },
    templateUrl : 'match/pending.ejs',
    controller  : 'matchPendingController'
  })
  .when('/users/user', {
    resolve: {
      "check": ["$location", "$rootScope", function($location, $rootScope){
        $rootScope.updateUser();
        if ($rootScope.username === undefined || $rootScope.username === 'undefined'){
          $location.path('/login');
        }
      }]
    },
    templateUrl : 'users/user.ejs',
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
            localStorage['mlg_points'] = $scope.data.value.mlg_points;
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
      $scope.mlg_points = $rootScope.mlg_points;
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
    localStorage['mlg_points'] = undefined;
    $rootScope.updateUser();
    // $scope.updateUser();
    $location.path('/');
  }


}]);
angular.module('cMLGApp').controller('matchCreateController', ['$scope', '$champions', '$matchFactory', '$location', '$users', '$masteryFactory', '$summoner', function($scope, $champions, $matchFactory, $location, $users, $masteryFactory, $summoner) {
  $scope.pageClass = "page-createMatch";
  $scope.betType = 0;
  
  $scope.min = function() {
    $scope.bet = 100;
  }

  $scope.max = function() {
    $scope.bet = 1000;
  }
  $scope.userData = {};
  $scope.opponentData = {};
  $scope.region = 'na';
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
  };

  //creating match
  $scope.createMatchRequest = function() {
    // creating match requests
    (function(){
      $scope.userData = $users.checkUsername(localStorage['username'], function() {
        //get summoner id for user
        var userSummonerID = $scope.userData.value.data.rows[0].summoner_id;
        //get champion mastery data by champion_id and summoner_id for user
        $scope.userMasteryData = $masteryFactory.getChampion($scope.region, userSummonerID, $scope.selectedChampion.id, function() {
          var userChampionPoints = $scope.userMasteryData.value.championPoints;
          //get 10 recent league games by summoner_id for user
          $scope.userRecentGameData = $summoner.getRecentGames($scope.region, userSummonerID, function() {
            var userLastGameId = $scope.userRecentGameData.value.data.games[0].gameId;
            $scope.opponentData = $users.checkUsername($scope.matchInviteForm.summonerName.$$rawModelValue, function(){
              //get summoner id for opponent
              var opponentSummonerID = $scope.opponentData.value.data.rows[0].summoner_id;
              //get champion mastery data by champion_id and summoner_id for opponent
              $scope.opponentMasteryData = $masteryFactory.getChampion($scope.region, opponentSummonerID, $scope.selectedChampion.id, function() {
                var opponentChampionPoints = $scope.opponentMasteryData.value.championPoints;
                //get 10 recent league games by summoner_id for opponent
                $scope.opponentRecentGameData = $summoner.getRecentGames($scope.region, opponentSummonerID, function() {
                  var createMatch_str = ""+localStorage['user_id']+"/"
                  +$scope.tournament_id+"/"
                  +userChampionPoints+"/"
                  + 0 +"/"
                  +userLastGameId+"/"
                  +opponentChampionPoints+"/"
                  + 0 +"/"
                  +$scope.opponentRecentGameData.value.data.games[0].gameId+"/"
                  +$scope.user_likes+"/"
                  +$scope.opponent_likes+"/"
                  + 1 +"/"
                  +$scope.bet*2;
                  
                  var matchid = $matchFactory.createMatch(createMatch_str, function(res){
                    console.log(res.data.rows[0].id);
                    $matchFactory.post(localStorage['user_id'], res.data.rows[0].id, $scope.selectedChampion.id, $scope.selectedChampion.key, $scope.bet, $scope.betType, $scope.matchType,2);
                    $matchFactory.post(2, res.data.rows[0].id, $scope.selectedChampion.id, $scope.selectedChampion.key, $scope.bet, $scope.betType, $scope.matchType,1);
                    $location.path('/match/pending');    
                  });
                });
              });   
            });
          });          
        });
      });
    })();


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
        }
      }
    }, 200);

  }

  $scope.data = $matchFactory.get(localStorage['user_id'], $scope.showMatchRequests());

  $scope.accept = function(request_id) {
    var data = $scope.data.value.data.rows;
    
    for (var key in data) {
      if (!data.hasOwnProperty(key)) continue;
      var obj = data[key];
    }

  };

  $scope.cancel = function(request_id) {
    var data = $scope.data.value.data.rows;
    
    for (var key in data) {
      if (!data.hasOwnProperty(key)) continue;
      var obj = data[key];
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
angular.module('cMLGApp').controller('userController', ['$scope', '$rootScope', 'ngDialog', '$document', '$matchFactory', function($scope, $rootScope, ngDialog, $document, $matchFactory) {
  
  $scope.pageClass = "page-user";

  $scope.user = {
    username: $rootScope.username,
    user_id: $rootScope.user_id,
    cur_mlg_points: parseInt($rootScope.mlg_points),
    total_mlg_points: parseInt($rootScope.mlg_points)
  }

  var getPieSeries = function(matchData) {
    var pieSeries = [];
    
    for (var i = 0; i < matchData.length; i++) {
      series = matchData[i].username1 + " VS " + matchData[i].username2;
      pieSeries.push(series);
    }

    return pieSeries;
  };

  var getPieData = function(matchData) {
    var pieData = [];

    // Reorganize data.
    var sortedData = [];
    for (var i = 0; i < matchData.length; i++) {
      sortedData.push({
        id: matchData[i].id,
        betPercent: matchData[i].betPercent,
        betAmt: matchData[i].bet,
        tooltip: matchData[i].username1 + " VS " + matchData[i].username2
      })
    }

    // Sort the data by their percentages.
    sortedData.sort(function(a, b) {
      return b.betPercent - a.betPercent;
    })

    // Add current points to start of the graph.
    sortedData.unshift({
      id: -1,
      betPercent: $scope.currentPtPercent,
      betAmt: $scope.user.cur_mlg_points,
      tooltip: 'Current Points'
    })

    var max = 5;

    if (sortedData.length < max) {
      max = sortedData.length;
    }

    for (var i = 0; i < max; i++) {
      var data = {
        x: sortedData[i].id, 
        y: [sortedData[i].betAmt],
        tooltip: sortedData[i].tooltip
      };
      pieData.push(data);
    }

    if (sortedData.length > max) {
      total_x = [];
      total_y = 0;
      for (var i = max - 1; i < sortedData.length; i++) {
        total_x.push(sortedData[i].id)
        total_y += sortedData[i].betAmt
      }
      pieData.push({
        x: total_x,
        y: [total_y],
        tooltip: 'Other'
      })
    }

    return pieData;
  };

  var getActiveMatches = function() {
    $scope.activeMatches = $matchFactory.getActiveMatches($rootScope.user_id, function() {
      var matches = $scope.activeMatches;
      if (matches.hasOwnProperty('status') && matches.status === 1) {

        if (matches.value.data.rowCount > 0) {
          $scope.matchData = matches.value.data.rows;

          // Determine total points and take care of null data.
          for (var i = 0; i < $scope.matchData.length; i++) {
            $scope.user.total_mlg_points += $scope.matchData[i].bet;
            if ($scope.matchData[i].user_points == null) {
              $scope.matchData[i].user_points = 0;
            }
            if ($scope.matchData[i].user_total_games_played == null) {
              $scope.matchData[i].user_total_games_played = 0;
            }
            if ($scope.matchData[i].user_likes == null) {
              $scope.matchData[i].user_likes = 0;
            }
          }

          $scope.currentPtPercent = parseFloat((100 * ($scope.user.cur_mlg_points / $scope.user.total_mlg_points)).toFixed(4));
    
          
          // Determine percentage.
          for (var i = 0; i < $scope.matchData.length; i++) {
            $scope.matchData[i].betPercent = parseFloat((100 * ($scope.matchData[i].bet / $scope.user.total_mlg_points)).toFixed(4));
          }
          
          $scope.data = {
            series: getPieSeries($scope.matchData),
            data: getPieData($scope.matchData)
          }
        }
      }
    })
  }
  getActiveMatches();

  $scope.config = {
    title: 'Current Matches',
    tooltips: true,
    labels: true,
    click: function() {
      $scope.getFocus();
    },
    isAnimate: true
  }

  $scope.getFocus = function() {
    var query = $document[0].getElementsByClassName("ac-tooltip");
    var wrappedClass = angular.element(query);
    $scope.currentPie = wrappedClass[0].textContent;

    for (var i = 0; i < $scope.data.data.length; i++) {
      if ($scope.data.data[i].tooltip == $scope.currentPie) {
        var matchID = $scope.data.data[i].x;

        if (matchID != -1) {
          // current matches
          if (typeof(matchID) == 'number') {
            $scope.multiPieData = undefined;
            for (var i = 0; i < $scope.matchData.length; i++) {
              if (matchID == $scope.matchData[i].id) {
                $scope.singlePieData = $scope.matchData[i];
              }
            }
          } else {
            $scope.singlePieData = undefined;
            $scope.multiPieData = [];
            for(var i = 0; i < matchID.length; i++) {
              for (var j = 0; j < $scope.matchData.length; j++) {
                if (matchID[i] == $scope.matchData[j].id) {
                  $scope.multiPieData.push($scope.matchData[i]);
                }
              }
            }
          }
        } else {
          // current points
          $scope.singlePieData = undefined;
          $scope.multiPieData = undefined;
        }
      }
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
        if(res.data.body===""){
          var json = {
            "playerId" : summonerID,
            "championId" : championID,
            "championLevel" : 0,
            "championPoints" : 0,
            "lastPlayTime" : 0,
            "championPointsSinceLastLevel" : 0,
            "championPointsUntilNextLevel" : 0,
            "chestGranted" : false
          }
        }else{
          var json = JSON.parse(res.data.body);
        }
        deferred.resolve(json);
        if(callback){
          callback();
        }
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
    post: function(user_id, match_id, champion_id, champion_key, bet, betType, matchType, status) {
      var url = '/db/post/match_request/'+user_id+'/'+match_id+'/'+champion_id+'/'+champion_key+'/'+bet+'/'+betType+'/'+matchType+'/'+status;
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
    createMatch: function(data_str, callback) {
      var deferred = $q.defer();
      var url = '/db/post/match/' + data_str;
      $http.post(url).then(function(res) {
        //success
        if(callback){
          callback(res);
        }
        deferred.resolve(res);
      })
      return deferred.promise.$$state;
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

        if (callback) {
          callback();
        }
      })
      return deferred.promise.$$state;
    },

    // All current matches for a user.
    getActiveMatches: function(user_id, callback) {
      var deferred = $q.defer();
      var url = '/db/get/match/current/' + user_id + '?callback=JSON_CALLBACK';
      $http.get(url).then(function(res) {
        //success
        var data = {};
        var result = res.data.rows;
        for (var key in result) {
          if (!result.hasOwnProperty(key)) continue;
          var obj = result[key];
          //getting champion image url
          obj.image = 'http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/'+obj.champion_key+'.png'
          //converting bet type int into str
          if(obj.bettype === 0){
            obj.bettype_str = 'Close Match';
          } else if(obj.bettype === 1){
            obj.bettype_str = 'Big Win';
          }
        };
        deferred.resolve(res);

        if (callback) {
          callback();
        }
      })
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
    },
    getRecentGames: function(region, summonerID, callback) {
      var deferred = $q.defer();

      var url = '/search/' + region +'/' + summonerID + '/recent' + JSONCALLBACK;
      $http.get(url)
      .then(function(res) {
        deferred.resolve(res);
      
        if(callback){
          callback();
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
              user_id: res.data.id, 
              mlg_points: res.data.mlg_points
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
          localStorage['mlg_points'] = res.data.rows[0].mlg_points;
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