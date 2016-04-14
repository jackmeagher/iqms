/**
 * Created by nick on 4/12/16.
 */

function conduct_interview_controller ($scope,$location,$http,$window,$routeParams) {
    interviewId = $routeParams.id;
    $http.get('/interview/' + interviewId).success(function (data) {
        $scope.interview = data.interview;
        //console.log(data);
    });
    $http.get('/interview/' + interviewId + '/questions').success(function (data) {
        //if (data.questions.len == 0)
        $scope.questions = data.questions;
    });

    $scope.post_answer = function(answer_text, rating, questionId, interviewId) {
        $http.post('/answer', {
            answer_text : answer_text,
            rating: rating,
            questionId: questionId,
            interviewId: interviewId
        }).success(function (data) => {
            $scope.lastAnswer = data;
        });
    };
}