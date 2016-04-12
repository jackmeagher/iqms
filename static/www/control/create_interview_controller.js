/**
 * Created by nick on 3/31/16.
 */

// controller
function create_interview_controller($scope, $http, $window) {
    $scope.current_questions  = [];     // set the default search/filter term

    $scope.addQuestion = function(question){
        if ($scope.current_questions.indexOf(question) < 0){
        $scope.current_questions.push(question.item);
    }}

    $scope.CreateInterview = function () {
        inter = document.getElementById("input-0").value;
        job_title = document.getElementById("job_title").value;

        var par1 = {interviewee: inter, label: job_title};

        $http.post('/interview',par1);
        $window.location.href = './#li';

    }
}

