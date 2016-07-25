/**
 * Created by nick on 4/12/16.
 */


function conduct_interview_controller ($scope,$location,$http,$window,$routeParams,$interval) {
    var interviewId = $routeParams.id;
    $scope.interview = {};
    $scope.questionList = {};
    $scope.currentTag = "";
    $scope.currentQuestions = [];
    
    
    $scope.questions = [];
    $scope.currentQuestion = {};
    $scope.currentAnswer  = '';
    $scope.currentQuestionIndex = 0;
    self.n_questions = 0;
    currentRating = 0;

    function mod(n, m) {
        return ((n % m) + m) % m;
    }
    Number.prototype.mod = function(n) {
        return ((this%n)+n)%n;
    };

    $scope.updateCurrentQuestion = function(i){

        $http.put('/answer',{answer:$scope.currentQuestion.answer}).success(function() {
            r = $scope.currentQuestion.answer.rating;
                angular.element('input:radio[name="rating"]').filter('[value="' + r + '"]').attr('checked', false);

            $scope.currentQuestionIndex = ($scope.currentQuestionIndex + i).mod(self.n_questions);

        $scope.currentQuestion = $scope.questions[$scope.currentQuestionIndex];


            $http.get('/answer/' +  interviewId + '/' + $scope.currentQuestion.id).success(function(answer){

                $scope.currentQuestion.answer = answer.answer;
                    console.log('loaded from db ' + answer.answer.rating);
                    document.getElementById('response').value = $scope.currentQuestion.answer.feedback;
                    rating = $scope.currentQuestion.answer.rating ? $scope.currentQuestion.answer.rating : 0;
                //angular.element('#fields_for_stars').val('' + rating);
                angular.element('input:radio[name="rating"]').filter('[value="' + rating + '"]').prop('checked', true);

                })





        });



    };
    $scope.click_answer_update = function()
    {
        $scope.currentQuestion.answer.feedback = document.getElementById('response').value;
        console.log($scope.currentQuestion.answer);
        $http.put('/answer',{answer:$scope.currentQuestion.answer}).success(function(){

        });
        console.log('answer updated to ' + $scope.currentQuestion.answer);
    };

    $('#response').bind('input propertychange', function() {

        $scope.click_answer_update();
    });

    
    $scope.collapseQuestion = function(id) {
        $('#collapse' + id).collapse('toggle');
    }
    

    $scope.star_update = function(id) {
        var dif = document.getElementById("the_stars" + id);
        var curr = dif.firstChild;
        while (curr != null) {
            if (curr.checked) {
                break;
            }
            curr = curr.nextSibling;

        }
        if(curr) {

          /* $scope.currentQuestion.answer.rating = curr.value;

            $http.put('/answer', {answer: $scope.currentQuestion.answer}).success(function () {
                console.log('updated stars with ' + curr.value);
            });*/
        }
    };


    //$interval($scope.star_update,250);




    $http.get('/interview/' + interviewId).success(function (data) {
        console.log(data);
        $scope.interview = data.interview;
        $http.get('/interview/' + interviewId +'/tags/').success(function(result) {
            console.log(result);
            result.tags.forEach(function(tag, index) {
                $scope.questionList[tag.name] = [];
                $http.get('/tag/' + tag.name + '/questions/').success(function(result) {
                   $scope.questionList[tag.name] = result.questions;
                   $scope.currentTag = "Technical";
                   $scope.currentQuestions = $scope.questionList[$scope.currentTag];
                });
            });
            console.log($scope.questionList);
        });
    });


       /* $http.get('/interview/' + interviewId +'/questions/').then(function (data) {
            $scope.questions = data.data.questions;
            $scope.currentQuestion = $scope.questions[0];
            self.n_questions = $scope.questions.length;
            //$scope.questions.forEach(q => q.answer = '');
            $http.get('/answer/' +  interviewId + '/' + $scope.currentQuestion.id).success(function(answer){
                    $scope.currentQuestion.answer = answer.answer;
                document.getElementById('response').value = $scope.currentQuestion.answer.feedback;

                rating = $scope.currentQuestion.answer.rating ? $scope.currentQuestion.answer.rating : 5;
                angular.element('input:radio[name="rating"]').filter('[value="' + rating + '"]').prop('checked', true);

                });


        });*/


}