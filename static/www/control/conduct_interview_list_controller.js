function conduct_interview_list_controller($scope, $http, socket) {
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
    
    /*function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        if ("withCredentials" in xhr) {

            // Check if the XMLHttpRequest object has a "withCredentials" property.
            // "withCredentials" only exists on XMLHTTPRequest2 objects.
            xhr.open(method, url, true, '', '');
            
        } else if (typeof XDomainRequest != "undefined") {

            // Otherwise, check if XDomainRequest.
            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
            xhr = new XDomainRequest();
            xhr.open(method, url);

        } else {

            // Otherwise, CORS is not supported by the browser.
            xhr = null;

        }
        console.log(xhr);
        return xhr;
    }

    var xhr = createCORSRequest('GET', "https://api.icims.com/customers/4765");
    if (!xhr) {
        throw new Error('CORS not supported');
    } else {
        xhr.send();
    }*/
}