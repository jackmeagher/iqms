/**
 * Created by nick on 3/31/16.
 */
/**
 * Created by Nicholas Desisto on 3/31/16.
 */

function create_interview_controller($scope, $http) {

    $scope.CreateInterview = function () {
        inter = document.getElementById("interviewee").value;
        job_title = document.getElementById("job_title").value;
        console.log(job_title);
        var par1 = JSON.stringify({interviewee: inter, label: job_title});
        var par1 = JSON.stringify({hello :'hello'});

        $http.post('/interview',par1);
    }
};

