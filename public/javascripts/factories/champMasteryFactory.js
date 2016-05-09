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