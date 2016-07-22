function question_flagger_controller($scope, $http, $rootScope, taggingService, flaggingService) {
    $scope.sortType     = 'id'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchQuestion   = '';     // set the default search/filter term

    $scope.tag = taggingService.getClickedTag();
    $http.get('/tag/' + $scope.tag + '/questions/').success(function (data) {
        $scope._question = data.questions;
        var flaggedQuestions = flaggingService.getQuestions();
        $scope._question.forEach(function(question, index) {
            if (flaggedQuestions[question.id]) {
                question.state = flaggedQuestions[question.id].state; 
            }
        });
        console.log(data);
    });
    
    $scope.saveQuestions = function() {
        flaggingService.addQuestions($scope._question);
    }
    
    $scope.getWindowLocation = function() {
        var winLoc = {};
        var loc = "" + window.location;
        winLoc.location = loc.substr(loc.lastIndexOf('/') + 1, 2);
        winLoc.id = window.location.hash.substr(5);
        return winLoc;  
    }

    var loc = $scope.getWindowLocation();
    if (loc.location === 'ie') {
        flaggingService.loadQuestionList(loc.id);
    }
    
    $rootScope.$on("flagNotification", function(event, args) {
        var flaggedQuestions = flaggingService.getQuestions();
        $scope._question.forEach(function(question, index) {
            if (flaggedQuestions[question.id]) {
                question.state = flaggedQuestions[question.id].state; 
            }
        });
    });
};