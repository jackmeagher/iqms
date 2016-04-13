/**
 * Created by nick on 4/5/16.
 */

function question_manager_controller($scope, $http) {
    $scope.sortType     = 'question_text'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchQuestion   = '';     // set the default search/filter term

    $http.get('/question').success(function (data) {
        $scope._question = data.questions;
        $scope._question.forEach(q => $http.get('/question/' + q.id + '/tags').success(function(tags){
            the_tags = tags.tags;
            q.tags = '';
            console.log(the_tags.length);
            if (the_tags.length > 1){
                for(var i = 0;i < the_tags.length-1;i++){
                    q.tags += the_tags[0].label;
                    q.tags += ','
                }
                q.tags += the_tags[i].label;

            }else if(the_tags.length == 1){
                q.tags = the_tags[0].label;
            }

        }));
    });




    $scope.DeleteQuestion = function (index,question) {
        $http.delete('/question/' + question.id)
            .success( function(){
                $http.get('/question').success(function(data){
                    $scope._question = data.questions;
                })}
            )};

};

