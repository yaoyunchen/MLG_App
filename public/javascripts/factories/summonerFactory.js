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