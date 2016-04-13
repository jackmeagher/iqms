/**
 * Created by nick on 3/31/16.
 */

function list_interview_controller($scope, $http) {

    $scope.sortType     = 'interviewee'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchInterview  = '';     // set the default search/filter term


    $http.get('/interview').success(function (data) {
        $scope._interview = data;
    });


    $scope.DeleteInterview = function (index,interview) {
        $http.delete('/interview/' + interview.id)
            .success( function(){
                $http.get('/interview').success(function(data){
                    $scope._interview = data;
                })}
            )};

};

