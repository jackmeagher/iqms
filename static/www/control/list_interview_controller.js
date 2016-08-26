function list_interview_controller($scope, $http, $location, userService, authService) {
    $scope.sortType     = 'id'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchInterview  = '';     // set the default search/filter term

    $scope.interviews = [];

    $scope.name = userService.getUserName();
    $scope.role = userService.getUserRole();

    var loadScreen = function() {
        authService.getUserToken(function(idToken) {
            if($scope.role != 'Admin' && $scope.role != 'Manager') {
                loadUserInterviews(idToken);
            } else {
                loadAllInterviews(idToken);
            }
        });
    };

    var loadUserInterviews = function(idToken) {
        $http.get('../../user/' + $scope.name + '/interviews/?idToken=' + idToken).success(function(data) {
            $scope.interviews = data.interviews;
            $scope.interviews.forEach(function(i) {
                loadCandidatePosition(i, idToken);
                i.canSee = true;
            });
        });
    };

    var loadAllInterviews = function(idToken) {
        $http.get('../../interview/?idToken=' + idToken).success(function(data) {
            $scope.interviews = data.interviews;
            $scope.interviews.forEach(function(i) {
                loadCandidatePosition(i, idToken);
                loadUsers(i, idToken);
            });
        });
    };

    var loadCandidatePosition = function(interview, idToken) {
        $http.get('../../candidatePosition/' + interview.candidatePositionCId + "?idToken=" + idToken).success(function(result) {
            loadCandidate(idToken, result.result.candidateId, interview);
            loadPosition(idToken, result.result.positionId, interview);
        });
    };

    var loadCandidate = function(idToken, id, interview) {
        $http.get('../../candidate/' + id + "?idToken=" + idToken).success(function(result) {
            interview.candidate = result.candidate.name;
            interview.candidate += getCandidateID({type: "Internal", info: result.candidate});
        });
    };

    var getCandidateID = function(options) {
        switch(options.type) {
            default:
            case("Internal"):
                var year = options.info.createdAt.substr(0, 4);
                return formatID(options.info.id, year);
        }
    };

    var loadPosition = function(idToken, id, interview) {
        $http.get('../../position/' + id + "?idToken=" + idToken).success(function(result) {
            interview.position = result.position.name;
            interview.position += getPositionID({type: "Internal", info: result.position});
        });
    };

    var getPositionID = function(options) {
        switch(options.type) {
            default:
            case("Internal"):
                var year = options.info.createdAt.substr(0, 4);
                return formatID(options.info.id, year);
        }
    };

    var formatID = function(id, year) {
        var formatted = " (#" + year + "-";
        if(id < 10) {
            formatted += "000" + id;
        } else if(id < 100) {
            formatted += "00" + id;
        } else if(id < 1000) {
            formatted += "0" + id;
        } else {
            formatted += id;
        }
        formatted += ")";
        return formatted;
    };

    var loadUsers = function(interview, idToken) {
        interview.canSee = false;
        $http.get('../../interview/' + interview.id + '/users/?idToken=' + idToken).success(function(data) {
            data.users.forEach(function(user) {
                if(user.name == $scope.name) {
                    interview.canSee = true;
                }
            });
        });
    };

    $scope.editInterview = function(id) {
        $location.path('/ci/');
        $location.hash(id);
    };

    $scope.loadInterview = function(id) {
        $location.path('/plan/' + id);
    };
    
    $scope.viewInterview = function(id) {
        $location.path('/view/' + id);
    };

    $scope.conductInterview = function(id) {
       $location.path('/conaction/' + id);
    };

    $scope.deleteInterview = function (index, interview) {
        authService.getUserToken(function(idToken) {
            $http.delete('../../interview/' + interview.id + '/tags?idToken=' + idToken).success(function() {
                $http.delete('../../interview/' + interview.id + '/questions?idToken=' + idToken).success(function() {
                    $http.delete('../../interview/' + interview.id + "?idToken=" + idToken).success(function() {
                        loadScreen();
                    });
                });
            });
        });
    };

    loadScreen();
}