function question_flagger_controller($scope, $http, taggingService) {
    $scope.sortType     = 'id'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchQuestion   = '';     // set the default search/filter term

    $scope.tag = taggingService.getClickedTag();
    
    $http.get('/tag/' + $scope.tag + '/questions/').success(function (data) {
        $scope._question = data.questions;
        console.log(data);
    });

};