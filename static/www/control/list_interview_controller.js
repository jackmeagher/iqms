/**
 * Created by nick on 3/31/16.
 */

function list_interview_controller($scope, $http) {

    $scope.sortType     = 'interviewee'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchInterview  = '';     // set the default search/filter term

    $scope.interviews = [];

    $scope.loadInterview = function(id) {
        window.location.href = "#ie#" + id;
    }
    
    $scope.deleteInterview = function (index,interview) {
        console.log("DELETING");
        $http.delete('/interview/' + interview.id + '/tags').success(function() {
           $http.delete('/interview/' + interview.id + '/questions').success(function() {
            $http.delete('/interview/' + interview.id).success(function() {
               $scope.loadScreen(); 
            });
           });
        });
    };

    $scope.loadScreen = function() {
        $http.get('/interview').success(function(data) {
            $scope.interviews = data.interviews;
            $scope.interviews.forEach(function(i, index) {
                $scope.loadInterviewer(i);
                $scope.loadCandidatePosition(i);
            });
        });
    }
    
    $scope.loadInterviewer = function(interview) {
        $http.get('/interviewer/' + interview.interviewerId).success(function(result) {
            interview.interviewer = result.result.name;
        });
    }
    
    $scope.loadCandidatePosition = function(interview) {
        $http.get('/candidatePosition/' + interview.candidatePositionCId).success(function(result) {
            $http.get('/candidate/' + result.result.candidateId).success(function(result) {
                interview.candidate = result.candidate.name;
            });
            $http.get('/position/' + result.result.positionId).success(function(result) {
                interview.position = result.position.name;
            });
         });
    }
    
    $scope.loadScreen();
};
