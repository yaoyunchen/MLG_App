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