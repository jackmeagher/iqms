function conduct_interview_list_controller($scope, $http) {
    $scope.sortType     = 'id';
    $scope.sortReverse  = false;
    $scope.searchInterview  = '';

    $scope.interviews = [];
    

    $scope.loadScreen = function() {
        $http.get('/interview').success(function(data) {
            $scope.interviews = data.interviews;
            $scope.interviews.forEach(function(i, index) {
                $scope.loadCandidatePosition(i);
            });
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
    
    $scope.conductInterview = function(id) {
        window.location.href = "#conaction/" + id;
    }
    
    $scope.loadScreen();
}