angular.module('tester.controllers', [])
//
//


.controller('AppCtrl', function($scope, $http, $rootScope) { // Main Controller
    $scope.albumArray = []

    $rootScope.fav = []

    $http.get('https://itunes.apple.com/us/rss/topalbums/limit=100/json').then(function (response) { //Get the json object
        $scope.albumArray = response.data.feed.entry; //save it to scope
    });

    new WOW().init(); //animations

    $scope.favorite = function($index){// Favorites logic
        var object = $index;
        $rootScope.fav.push($scope.albumArray[object]);
    }

    $scope.removeItem = function($index){ //delete favorite
        $scope.fav.splice($index, 1);
    }

    $scope.date = new Date(); //Todays date

})

//
//

