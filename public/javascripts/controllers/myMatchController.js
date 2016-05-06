angular.module('cMLGApp').controller('myMatchController', ['$scope', function($scope) {
  $scope.pageClass = "page-myMatch";
        // Configuration settings for the graph.
      $scope.config = {
        title: 'title',
        tooltips: true,
        labels: true,
        isAnimate: true
      };

      // Data for the graph.
      $scope.data = {
        series: ['a','b','c','d'],
        data: [1,2,3,4]
      };
}]);
