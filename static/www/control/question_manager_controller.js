/**
 * Created by nick on 4/5/16.
 */

function question_manager_controller($scope, $http) {
    $scope.sortType     = 'question_text'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchQuestion   = '';     // set the default search/filter term

    $http.get('/question').success(function (data) {
        $scope._question = data;
    });


    $scope.DeleteQuestion = function (index,question) {
        $http.delete('/question/' + question.id)
            .success( function(){
                $http.get('/question').success(function(data){
                    $scope._question = data;
                })}
            )};

};

