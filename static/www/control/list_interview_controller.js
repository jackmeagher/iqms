/**
 * Created by nick on 3/31/16.
 */

function list_interview_controller($scope, $http) {

    $scope.sortType     = 'interviewee'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchInterview  = '';     // set the default search/filter term


    $http.get('/interview').success(function (data) {
        $scope._interview = data;
        //get all question_text associated with interviews
        $scope._interviews.forEach(q => $http.get('/interview/' + q.id + '/questions').success(function(data){
            the_questions = data.questions;
            q.questions = '';
            console.log(the_questions.length);
            if (the_questions.length > 1){
                for(var i = 0;i < the_questions.length-1;i++){
                    q.questions += the_questions[0].question_text;
                    q.questions += ','
                }
                q.questions += the_questions[i].question_text;

            }else if(the_questions.length == 1){
                q.questions = the_questions[0].questions_text;
            }

        }));
    });


    $scope.DeleteInterview = function (index,interview) {
        $http.delete('/interview/' + interview.id)
            .success( function(){
                $http.get('/interview').success(function(data){
                    $scope._interview = data;
                })}
            )};

};
