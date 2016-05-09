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
