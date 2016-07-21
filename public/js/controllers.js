angular.module('tester.controllers', [])
//
//


.controller('AppCtrl', function($scope, $http, $rootScope) { // Main Controller
    $scope.albumArray = []

    $rootScope.fav = []

    $scope.status = false;

    $http.get('https://itunes.apple.com/us/rss/topalbums/limit=100/json').then(function (response) { //Get the json object
        $scope.albumArray = response.data.feed.entry; //save it to scope
        console.log($scope.albumArray); //seeing what I saved
    });

    new WOW().init(); //animations

    $scope.favorite = function($index){
        var object = $index;
        $rootScope.fav.push($scope.albumArray[object]);
    }

    $scope.removeItem = function($index){
        $scope.fav.splice($index, 1);
    }
})

//
//

