angular.module('tester.controllers', [])
//
//
.controller('AppCtrl', function($scope, $http) { // Main Controller
    $scope.albumArray = []
    $http({
        method: 'GET',
        url: 'https://itunes.apple.com/us/rss/topalbums/limit=100/json'
    }).then(function (response) {
        $scope.albumArray = response.data.feed.entry;
        console.log($scope.albumArray);
    });

})
//
//

