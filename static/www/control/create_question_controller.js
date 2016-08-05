function create_question_controller ($scope, $rootScope, $location, $http,$window, taggingService) {

    $scope.questionData = {
        text: '',
        tags: [],
        selectedTags: {},
        answers: [''],
        difficulty: 0,
        category: 'Skills'
    };

    
    $scope.updateCategory = function() {
        taggingService.setCategory($scope.questionData.category);
        $scope.refreshTags();
    }
    
    $rootScope.$on("tagNotification", function(event, args) {
        $scope.refreshTags();
    });

    $scope.removeTag = function(tag) {
        taggingService.removeTag(tag);
        $scope.refreshTags();
    }
    
    $scope.addAnswer = function() {
        $scope.questionData.answers.push('');
    }
    
    $scope.removeAnswer = function() {
        if ($scope.questionData.answers.length > 1) {
            $scope.questionData.answers.pop();
        }
    }
    
    $scope.compileData = function () {
        $scope.questionData.difficulty = parseInt($("#modelValue").val());
        var loc = $scope.getWindowLocation();
        if (loc.location === 'ce') {
            $scope.submitQuestion($scope.questionData, loc.id);
        } else if (loc.location === 'cq') {
            $scope.submitQuestion($scope.questionData, -1);
        } else if($location.path() != '/cq' && $location.path() != '/ce') {
            $scope.submitQuestion($scope.questionData, -2);
        }
    }
    
    $scope.submitQuestion = function(questionData, id) {
        if (id > 0) {
            $http.put('/question/' + id, questionData).success(function(created) {
                taggingService.updateTags(true);
                $window.location.href = './#qm';
                taggingService.persistQuestionTag(id);
            });
        } else if(id == -1) {
           $http.post('/question',  questionData).success(function(created) {
                taggingService.updateTags(false);
                $window.location.href = './#qm';
                taggingService.persistQuestionTag(created.question.id);
            }); 
        } else if(id == -2) {
            $http.post('/question',  questionData).success(function(created) {
                $scope.questionData = created.question;
                $rootScope.$broadcast('interviewQuestion', $scope.questionData);
                taggingService.updateTags(false);
                taggingService.addTag("Inline");
                taggingService.persistQuestionTag(created.question.id);
            });
        }
    }
    
    $scope.loadQuestion = function() {
        taggingService.resetTags();
        var loc = $scope.getWindowLocation();
        if (loc.location === 'ce') {
            $http.get('/question/' + loc.id).success(function(data) {
                $scope.questionData.questionText = data.question.text;
                taggingService.loadSavedTags(data.question.id);
                $scope.refreshTags();
                $('#modelValue').val(data.question.difficulty);
                $scope.questionData.answers = data.question.answers;
            })
        } else if (loc.location === 'cq') {
            taggingService.addTag('Skills');
            $scope.refreshTags();
        } else {
            taggingService.addTag('Skills');
            $scope.refreshTags();
        }
    }
    
    $scope.getTagCount = function(tag) {
        return taggingService.countTag(tag);
    }
    
    $scope.refreshTags = function() {
        $scope.questionData.category = taggingService.getCategory();
        $scope.questionData.tags = taggingService.getTags();
        $scope.questionData.selectedTags = taggingService.getSelectedTags();
    }
    
    $scope.getWindowLocation = function() {
        var winLoc = {};
        var loc = "" + $window.location;
        winLoc.location = loc.substr(loc.lastIndexOf('/') + 1, 2);
        winLoc.id = $window.location.hash.substr(5);
        return winLoc;  
    }

    $scope.cancelQuestion = function() {
        if($location.path() == '/cq' || $location.path() == '/ce') {
            $location.path('/qm');
        }
    }
    
    $scope.loadQuestion();
}

