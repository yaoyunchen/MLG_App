angular.module('cMLGApp').controller('userController', ['$scope', '$rootScope', 'ngDialog', '$document', function($scope, $rootScope, ngDialog, $document) {
  
  $scope.pageClass = "page-user";

  $scope.user = {
    username: $rootScope.username,
    user_id: $rootScope.user_id
  }

  var getPieScope = function() {
    var pieScope = [];

    return ['one', 'two', 'three'];
  };

  var getPieData = function() {
    var pieData = [];

    
    return [
      {x: 'one', y: [1], tooltip: 'first'},
      {x: 'two', y: [2], tooltip: 'second'},
      {x: 'three', y: [3], tooltip: 'third'}
    ]
  };

  $scope.config = {
    title: 'Current Matches',
    tooltips: true,
    labels: true,
    click: function() {
      $scope.getFocus();
    },
    isAnimate: false
  }

  $scope.data = {
    series: getPieScope(),
    data: getPieData()
  }

  $scope.getFocus = function() {
    var query = $document[0].getElementsByClassName("ac-tooltip");
    var wrappedClass = angular.element(query);
    $scope.currentPie = wrappedClass[0].textContent;

    for (var i = 0; i < $scope.data.data.length; i++) {
      if ($scope.data.data[i].tooltip == $scope.currentPie) {
        $scope.pieData = $scope.data.data[i];
      }
    }
  } 



}]);
