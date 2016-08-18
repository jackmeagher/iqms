function create_question_controller ($scope, $rootScope, $location, $http, taggingService, authService) {

    $scope.questionData = {
        text: '',
        tags: [],
        selectedTags: {},
        answers: [''],
        difficulty: 0,
        category: 'skills'
    };

    var loadQuestion = function() {
        taggingService.resetTags();
        if ($location.path() === '/ce') {
            instantiateOldQuestion();
        } else {
            instantiateNewQuestion();
        }
    };

    var instantiateOldQuestion = function() {
        authService.getUserToken(function(idToken) {
            $http.get('/question/' + $location.hash() + "?idToken=" + idToken).success(function(data) {
                $scope.questionData.text = data.question.text;
                taggingService.loadSavedTags(data.question.id, idToken);
                refreshTags();
                $('#modelValue').val(data.question.difficulty);
                $scope.questionData.answers = data.question.answers;
            })
        });
    };

    var instantiateNewQuestion = function() {
        taggingService.addTag($scope.questionData.category);
        refreshTags();
        $scope.updateCategory();
    };

    $scope.compileData = function () {
        $scope.questionData.difficulty = parseInt($('#modelValue').val());
        if ($location.path() === '/ce') {
            submitQuestion($scope.questionData, $location.hash());
        } else if ($location.path() === '/cq') {
            submitQuestion($scope.questionData, -1);
        } else if($location.path() != '/cq' && $location.path() != '/ce') {
            submitQuestion($scope.questionData, -2);
        }
    };

    var submitQuestion = function(questionData, id) {
        authService.getUserToken(function(idToken) {
            if(id > 0) {
                $http.put('/question/' + id + "?idToken=" + idToken, questionData).success(function(created) {
                    $location.path('/qm');
                    taggingService.persistQuestionTag(id);
                });
            } else if(id == -1) {
                $http.post('/question?idToken=' + idToken,  questionData).success(function(created) {
                    $location.path('/qm');
                    taggingService.persistQuestionTag(created.question.id);
                });
            } else if(id == -2) {
                $http.post('/question?idToken=' + idToken,  questionData).success(function(created) {
                    $scope.questionData = created.question;
                    $rootScope.$broadcast('interviewQuestion', $scope.questionData);
                    taggingService.addTag("inline");
                    taggingService.persistQuestionTag(created.question.id);
                });
            }
        });
    };

    $scope.addAnswer = function() {
        $scope.questionData.answers.push('');
    };

    $scope.removeAnswer = function() {
        if ($scope.questionData.answers.length > 1) {
            $scope.questionData.answers.pop();
        }
    };

    $scope.cancelQuestion = function() {
        if($location.path() == '/cq' || $location.path() == '/ce') {
            $location.path('/qm');
        }
    };

    $scope.updateCategory = function() {
        taggingService.setCategory($scope.questionData.category);
        refreshTags();
    };
    
    $rootScope.$on("tagNotification", function() {
        refreshTags();
    });

    $scope.removeTag = function(tag) {
        taggingService.removeTag(tag);
        refreshTags();
    };
    
    var refreshTags = function() {
        $scope.questionData.category = taggingService.getCategory();
        $scope.questionData.tags = taggingService.getTags();
        $scope.questionData.selectedTags = taggingService.getSelectedTags();
    };
    
    loadQuestion();
}