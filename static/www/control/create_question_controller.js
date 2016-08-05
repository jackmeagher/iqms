function create_question_controller ($scope, $rootScope, $location,$http,$window, taggingService, popupService) {
    
    $scope.questionText = '';
    $scope.tags = [];
    $scope.selectedTags = {};
    $scope.answers = [''];
    $scope.difficulty = 0;
    $scope.category = 'Skills';
    
    $scope.updateCategory = function() {
        taggingService.setCategory($scope.category);
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
        $scope.answers.push('');
    }
    
    $scope.removeAnswer = function() {
        if ($scope.answers.length > 1) {
            $scope.answers.pop();
        }
    }
    
    $scope.compileData = function () {
        var questionData = {
            text: '',
            tags: [],
            difficulty: 0,
            answers: []
        };
        
        questionData.text = $scope.questionText;
        questionData.tags = taggingService.getSelectedTagsAsArray();
        questionData.difficulty = parseInt($("#modelValue").val());
        questionData.answers = $scope.answers;
        
        var loc = $scope.getWindowLocation();
        if (loc.location === 'ce') {
            $scope.submitQuestion(questionData, loc.id);
        } else if (loc.location === 'cq') {
            $scope.submitQuestion(questionData, -1);
        }
    }
    
    $scope.submitQuestion = function(questionData, id) {
        if (id > 0) {
            $http.put('/question/' + id, questionData).success(function(created) {
                taggingService.updateTags(true);
                $window.location.href = './#qm';
                taggingService.persistQuestionTag(id);
            });
        } else {
           $http.post('/question',  questionData).success(function(created) {
                taggingService.updateTags(false);
                $window.location.href = './#qm';
                taggingService.persistQuestionTag(created.question.id);
            }); 
        }
        
    }
    
    $scope.loadQuestion = function() {
        taggingService.resetTags();
        var loc = $scope.getWindowLocation();
        if (loc.location === 'ce') {
            $http.get('/question/' + loc.id).success(function(data) {
                $scope.questionText = data.question.text;
                taggingService.loadSavedTags(data.question.id);
                $scope.refreshTags();
                $('#modelValue').val(data.question.difficulty);
                $scope.answers = data.question.answers;
            })
        } else if (loc.location === 'cq') {
            taggingService.addTag('Skills');
            $scope.refreshTags();
        }
    }
    
    $scope.getTagCount = function(tag) {
        return taggingService.countTag(tag);
    }
    
    $scope.refreshTags = function() {
        $scope.category = taggingService.getCategory();
        $scope.tags = taggingService.getTags();
        $scope.selectedTags = taggingService.getSelectedTags();
    }
    
    $scope.getWindowLocation = function() {
        var winLoc = {};
        var loc = "" + $window.location;
        winLoc.location = loc.substr(loc.lastIndexOf('/') + 1, 2);
        winLoc.id = $window.location.hash.substr(5);
        return winLoc;  
    }
    
    $scope.loadQuestion();
}

