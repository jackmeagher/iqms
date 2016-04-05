/**
 * Created by nick on 4/5/16.
 */

function list_interview_controller($scope, $http) {

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

