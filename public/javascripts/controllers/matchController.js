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
