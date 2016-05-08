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