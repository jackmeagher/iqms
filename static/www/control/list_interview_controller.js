/**
 * Created by nick on 3/31/16.
 */

function list_interview_controller($scope, $http) {

    $scope.sortType     = 'interviewee'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchInterview  = '';     // set the default search/filter term

    $scope.interviews = [];

    $http.get('/interview').success(function (data) {
        for (var i = 0; i < data.interviews.length; i++) {
            var interview = {};
            interview.id = data.interviews[i].id;
            $http.get('/interviewer/' + data.interviews[i].interviewerId).success(function(result) {
               interview.interviewer = result.result.name;
            });
            $http.get('/candidatePosition/' + data.interviews[i].candidatePositionCId).success(function(result) {
               $http.get('/candidate/' + result.result.candidateId).success(function(result) {
                interview.candidate = result.candidate.name;
               });
               $http.get('/position/' + result.result.positionId).success(function(result) {
                interview.position = result.position.name;
               });
            });
            $scope.interviews.push(interview);
        }
        $scope._interview = data;
        console.log(data);
    });


    $scope.DeleteInterview = function (index,interview) {
        $http.delete('/interview/' + interview.id)
            .success( function(){
                $http.get('/interview').success(function(data){
                    $scope._interview = data;
                })}
            )};

};
