/**
 * Created by nick on 3/31/16.
 */

function create_interview_controller($scope, $http, $window) {

    $scope.CreateInterview = function () {
        inter = document.getElementById("interviewee").value;
        job_title = document.getElementById("job_title").value;

        console.log(job_title);
        var par1 = {interviewee: inter, label: job_title};

        $http.post('/interview',par1);
        $window.location.href = './listInterviews.html';

    }
};

