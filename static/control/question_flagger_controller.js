function question_flagger_controller($scope, $http, $rootScope, $location, taggingService, flaggingService, authService) {
    $scope.sortType     = 'id'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchQuestion   = '';     // set the default search/filter term

    $scope.tag = taggingService.getClickedTag();

    $scope.saveQuestions = function() {
        flaggingService.addQuestions($scope._question);
    };

    $rootScope.$on("flagNotification", function() {
        var flaggedQuestions = flaggingService.getQuestions();
        $scope._question.forEach(function(question) {
            if (flaggedQuestions[question.id]) {
                question.state = flaggedQuestions[question.id].state;
            }
        });
    });

    var loadTags = function(idToken) {
        $http.get('../../tag/' + $scope.tag + '/questions/?idToken=' + idToken).success(function (data) {
            $scope._question = data.questions;
            var flaggedQuestions = flaggingService.getQuestions();
            $scope._question.forEach(function(question) {
                if (flaggedQuestions[question.id]) {
                    question.state = flaggedQuestions[question.id].state;
                }
            });
        });
    };

    authService.getUserToken(function(idToken) {
        loadTags(idToken);
    });

    if ($location.path() === '/plan') {
        flaggingService.loadQuestionList($location.hash());
    }
}