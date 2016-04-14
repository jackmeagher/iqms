/**
 * Created by nick on 4/12/16.
 */

function conduct_interview_controller ($scope,$location,$http,$window,$routeParams) {
    var interviewId = $routeParams.id;
    $scope.unansweredQuestions = [];
    $scope.currentQuestion = {};
    $http.get('/interview/' + interviewId).success(function (data) {
        $scope.interview = data.interview;
        $http.get('/interview/' + interviewId + '/questions').success(function (data) {
            //if (data.questions.len == 0)
            $scope.questions = data.questions;

            $scope.post_answer = function() {
                var answer_text = document.getElementById('answer_text').value();
                var rating = document.getElementById('rating').value();
                var questionId = -1;
                if(currentQuestion) {
                    questionId = currentQuestion.id;
                } else {
                    return;
                }
                $http.post('/answer', {
                    answer_text : answer_text,
                    rating: rating,
                    questionId: questionId,
                    interviewId: interviewId
                }).then(function (data) {
                    $scope.lastAnswer = data;
                });
            };
        });

        //console.log(data);
    });

    $scope.get_unanswered_questions = function() {
        $http.get('/answer/interview/unanswered_questions/' + interviewId).then(function (data) {
            $scope.unansweredQuestions = data.unansweredQuestions;
            $scope.current_question = $scope.unansweredQuestions[0];
        });
    }

}