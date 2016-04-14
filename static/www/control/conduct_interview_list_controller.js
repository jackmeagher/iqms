/**
 * Created by nick on 4/12/16.
 */
/**
 * Created by nick on 3/31/16.
 */

function conduct_interview_list_controller($scope, $http) {

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

}