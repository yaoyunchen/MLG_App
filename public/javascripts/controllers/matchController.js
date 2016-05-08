angular.module('cMLGApp').controller('matchCreateController', ['$scope', '$champions', '$matchFactory', '$location', function($scope, $champions, $matchFactory, $location) {
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
  $scope.user = {};
  $scope.matchType = 1;

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



    // $matchFactory.post(localStorage['user_id'], $scope.selectedChampion.id, $scope.bet, $scope.betType, $scope.matchType);
    // $matchFactory.post($scope.user_id, $scope.selectedChampion.id, $scope.bet, $scope.betType, $scope.matchType);
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
