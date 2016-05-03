angular.module('cMLGApp').directive('signup', function($timeout, $q, $http) {
  return {
    retrict: 'AE',
    require: 'ngModel',
    link: function(scope, elm, attr, model) {
      
      model.$asyncValidators.summonerRegistered = function() { 
        return $http.get('test.json')
          .then(function(res) {
            $timeout(function() {
              if (res.status == 200) {
                if (res.data === true) {
                  // Summoner registered in our database.
                  model.$setValidity('summonerRegistered', false);
                  console.log('true');
                } else if (res.data === false) {
                  // Summoner is not registered, check if the name entered is actual summoner name.
                  summonerExists();
                }
              } 
            }, 1000);
          }, function(res){
            // Unable to connect to users database to verify summoner name.
            model.$setValidity('connection', false);
          });
      };

      summonerExists = function() {
        var region = 'na';
        var name = scope.signupForm.signupName.$$rawModelValue;
        var url = '/search/' + region + '/' + name + '?callback=JSON_CALLBACK';

        return $http.get(url)
          .then(function(res) {
            // Connected to LoL API to confirm summoner actually exists.
            $timeout(function() {
              if (res.status == 200) {
                // Successful connection to routes and have data returned.  
                if (res.data.hasOwnProperty(name)) {
                  // If returned data contains a summoner's information.
                  scope.summoner.name = res.data[name].name;
                  scope.summoner.id = res.data[name].id;
                  scope.summoner.icon = res.data[name].profileIconId;

                  model.$setValidity('summonerExists', true);
                } else if (res.data.hasOwnProperty('status') && res.data.status.status_code == 404) {
                  // If returned data shows that the summoner is not found.
                  scope.summoner = {};

                  model.$setValidity('summonerExists', false);
                }
              }
            }, 1000);
          }, function(res) {
            // Unable to connect to LoL API to verify summoner name.
            model.$setValidity('connection', false);
          });
      };
    }
  };
});