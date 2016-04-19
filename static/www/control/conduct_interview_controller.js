/**
 * Created by nick on 4/12/16.
 */

function conduct_interview_controller ($scope,$location,$http,$window,$routeParams) {
    var interviewId = $routeParams.id;
    $scope.questions = [];
    $scope.currentQuestion = {};
    $scope.currentAnswer  = '';
    $scope.currentQuestionIndex = 1;
    self.n_questions = 0;

    function mod(n, m) {
        return ((n % m) + m) % m;
    }

    $scope.updateCurrentQuestion = function(i){
        $scope.currentQuestionIndex = mod(($scope.currentQuestionIndex + i) ,self.n_questions);
        console.log($scope.currentQuestionIndex);

        $scope.currentQuestion = $scope.questions[$scope.currentQuestionIndex];



            document.getElementById('response').value = $scope.currentQuestion.answer ? $scope.currentQuestion.answer : '';

    };
    $scope.click_answer_update = function()
    {
        $scope.currentQuestion.answer = document.getElementById('response').value;
        console.log('answer updated to ' + $scope.currentQuestion.answer);
    };

    $('#response').bind('input propertychange', function() {

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