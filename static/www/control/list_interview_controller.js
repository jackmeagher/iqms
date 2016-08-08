/**
 * Created by nick on 3/31/16.
 */

function list_interview_controller($scope, $http, $location) {

    $scope.sortType     = 'id'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchInterview  = '';     // set the default search/filter term

    $scope.interviews = [];

    $scope.loadInterview = function(id) {
        $location.path('/plan/' + id);
    }
    
    $scope.viewInterview = function(id) {
         window.location.href = "#view/" + id;
    }

    $scope.conductInterview = function(id) {
        window.location.href = "#conaction/" + id;
    }

    $scope.deleteInterview = function (index,interview) {
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
                $scope.loadCandidatePosition(i);
            });
        });
    }
    
    $scope.loadCandidatePosition = function(interview) {
        $http.get('/candidatePosition/' + interview.candidatePositionCId).success(function(result) {
            $http.get('/candidate/' + result.result.candidateId).success(function(result) {
                interview.candidate = result.candidate.name;
                interview.candidate += getCandidateID({type: "Internal", info: result.candidate});
            });
            $http.get('/position/' + result.result.positionId).success(function(result) {
                interview.position = result.position.name;
                interview.position += getPositionID({type: "Internal", info: result.position});
            });
         });
    }

    var getCandidateID = function(options) {
        switch(options.type) {
            default:
            case("Internal"):
                var year = options.info.createdAt.substr(0, 4);
                return formatID(options.info.id, year);
        }
    }

    var getPositionID = function(options) {
        switch(options.type) {
            default:
            case("Internal"):
                var year = options.info.createdAt.substr(0, 4);
                return formatID(options.info.id, year);
        }
    }

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
    }

    $scope.loadScreen();
};
