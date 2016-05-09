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
