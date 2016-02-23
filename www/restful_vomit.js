/**
 * Created by malcolmbyrd on 2/18/16.
 */

function restful_vomit($scope, $http) {
    $http.get('http://127.0.0.1:3000/question').
    success(function(data) {
        $scope.questions = data;
    });
    $http.get('http://127.0.0.1:3000/interview').
    success(function(data) {
        $scope.interview = data;
    });
    $http.get('http://127.0.0.1:3000/answer').
    success(function(data) {
        $scope.answers = data;
    });
    $http.get('http://127.0.0.1:3000/user').
    success(function(data) {
        $scope.users = data;
    });
}

