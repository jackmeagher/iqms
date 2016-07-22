function question_flagger_controller($scope, $http, taggingService, flaggingService) {
    $scope.sortType     = 'id'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchQuestion   = '';     // set the default search/filter term

    $scope.tag = taggingService.getClickedTag();
    
    $http.get('/tag/' + $scope.tag + '/questions/').success(function (data) {
        $scope._question = data.questions;
        var flaggedQuestions = flaggingService.getQuestions();
        $scope._question.forEach(function(question, index) {
           flaggedQuestions.forEach(function(qs, id) {
            if (question.id == qs.id) {
                question.state = qs.state;
            }
           });
        });
        console.log(data);
    });
    
    $scope.saveQuestions = function() {
        flaggingService.addQuestions($scope._question);
    }

};