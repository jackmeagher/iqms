/**
 * Created by malcolmbyrd on 2/18/16.
 */

function helloQuestion($scope, $http) {
    $http.get('127.0.0.1:3000/question').
    success(function(data) {
        $scope.greeting = data;
    });
}