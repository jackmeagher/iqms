/**
 * Created by malcolmbyrd on 2/18/16.
 */

function data_insertion($scope, $http) {

    $http.get('/question').success(function (data) {
        $scope._question = data;
    });

    $http.get('/interview').success(function (data) {
        $scope._interview = data;
    });

    $http.get('/answer').success(function (data) {
        $scope._answer = data;
    });

    $http.get('/user').success(function (data) {
        $scope._user = data;
    });




    $scope.DeleteInterview = function (index,interview) {
        $http.delete('/interview/' + interview.id)
            .success( function(){
                $http.get('/interview').success(function(data){
                    $scope._interview = data;
            })}
            )};



    /* Define questionsFields for dynamic form */
    $scope.questionFields = [{id: 'questionField1'}, {id: 'questionField2'}, {id: 'questionField3'}, {id: 'questionField4'},
        {id: 'questionField5'}];

    /* Define a new field to be created */
    $scope.addNewQuestionField = function () {
        var newItemNo = $scope.questionFields.length + 1;
        $scope.questionFields.push({'id': 'questionField' + newItemNo});
    };

    /* Function to add new question field */
    $scope.showAddQuestionFields = function (questionField) {
        return questionField.id === $scope.questionFields[$scope.questionFields.length - 1].id;
    };
};

