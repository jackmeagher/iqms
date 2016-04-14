/**
 * Created by nick on 4/12/16.
 */

function conduct_interview_controller ($scope,$location,$http,$window,$routeParams) {
    var interviewId = $routeParams.id;
    $scope.questions = [];
    $scope.currentQuestion = {};
    $scope.currentQuestionIndex = 1;
    self.n_questions = 0;

    $scope.updateCurrentQuestion = function(i){
        console.log($scope.currentQuestionIndex);
        if ( $scope.currentQuestionIndex < self.n_questions -1 ) {
            $scope.currentQuestionIndex = ($scope.currentQuestionIndex + i);
            $scope.currentQuestion = $scope.questions[$scope.currentQuestionIndex];
        }
        else{
            $scope.currentQuestionIndex = 0;
        }
    };
    $scope.click_answer_update = function()
    {
        $scope.currentQuestion.answer = document.getElementById('response').data;
    };

    $( "#response" ).change(function() {
        $scope.click_answer_update();
    });


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


        $http.get('/interview/' + interviewId +'/questions/').then(function (data) {
            $scope.questions = data.data.questions;
            $scope.currentQuestion = $scope.questions[0];
            self.n_questions = $scope.questions.length;
            $scope.questions.forEach(q => q.answer = '');
        });

}