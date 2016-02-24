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
        $scope.interviews = data;
    });
    $http.get('http://127.0.0.1:3000/answer').
    success(function(data) {
        $scope.answers = data;
    });
    $http.get('http://127.0.0.1:3000/user').
    success(function(data) {
        $scope.users = data;
    });


    $http.get('http://127.0.0.1:3000/question/3').
    success(function(data) {
        $scope.question3 = data;
    });

    $http.get('http://127.0.0.1:3000/interview/1').
    success(function(data) {
        $scope.answer1 = data;
    });

    $http.get('http://127.0.0.1:3000/answer/1').
    success(function(data) {
        $scope.answer1 = data;
    });

}

