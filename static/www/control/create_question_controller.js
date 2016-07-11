/**
 * Created by nick on 4/6/16.
 */

function create_question_controller ($scope,$location,$http,$window, taggingService, popupService) {
    
    $scope.questionText = '';
    $scope.tags = [];
    $scope.selectedTags = [];
    $scope.answers = [''];
    $scope.difficulty = 0;
    $scope.tech = true;
    
    $scope.questionData = {
      text: '',
      tags: [],
      difficulty: 0,
      tech: true,
      answers: []
    };
    
    //Type
    
    $scope.updateTech = function(tech) {
        taggingService.setTech(tech);
        $scope.tech = taggingService.getTech();
        $scope.tags = taggingService.getTags();
        $scope.selectedTags = taggingService.getSelectedTags();
    }

    //Tag
    
    $scope.$on("tagNotification", function(event, args) {
        $scope.tags = taggingService.getTags();
        $scope.selectedTags = taggingService.getSelectedTags();
    });
    
    $scope.removeTag = function(tag) {
        if (tag != "Technical") {
            taggingService.removeTag(tag);
        } else {
            taggingService.setTech(false);
            $scope.tech = taggingService.getTech();
        }
        
        $scope.tags = taggingService.getTags();
        $scope.selectedTags = taggingService.getSelectedTags();
    }
    
    //Answer
    
    $scope.addAnswer = function() {
        $scope.answers.push('');
    }
    
    $scope.removeAnswer = function() {
        if ($scope.answers.length > 1) {
            $scope.answers.pop();
        }
    }
    
    //Submit
    
    $scope.compileData = function () {
        $scope.questionText = $('#question_text').val();
        $scope.questionData.text = $scope.questionText;
        $scope.questionData.tags = taggingService.getSelectedTags();
        $scope.questionData.difficulty = parseInt($("#modelValue").val());
        $scope.questionData.tech = $scope.tech;
        $scope.questionData.answers = [];
        $('.answer-box').each(function(index) {
           $scope.questionData.answers.push($(this).val()); 
        });
        
        var loc = "" + $window.location;
        loc = loc.substr(loc.lastIndexOf('/') + 1, 2);
        var id = $window.location.hash.substr(5);
        
        //Check if we are edit or create
        if (loc === 'ce') {
            $scope.editQuestion(id);
        } else if (loc === 'cq') {
            $scope.createQuestion();
        }
        
    }
    
    
    //Interaction with question database
    $scope.createQuestion = function () {
        $http.post('/question',  $scope.questionData).success(function(created){
                $window.location.href = './#qm';
            });
    }
    
    $scope.editQuestion = function(id) {
        $http.put('/question/' + id, $scope.questionData).success(function(created) {
           $window.location.href = './#qm'; 
        });
    }
    
    $scope.loadQuestion = function() {
        var loc = "" + $window.location;
        loc = loc.substr(loc.lastIndexOf('/') + 1, 2);
        var id = $window.location.hash.substr(5);
        if (loc === 'ce') {
            $http.get('/question/' + id).success(function(data) {
                $('#question_text').val(data.question.text);     
                data.question.tags.forEach(function(tag, index) {
                   taggingService.addTag(tag); 
                });
                $scope.tags = taggingService.getTags();
                $scope.selectedTags = taggingService.getSelectedTags();
                $scope.tech = data.question.tech;
                $('#modelValue').val(data.question.difficulty);
                $scope.answers = data.question.answers;
                data.question.answers.forEach(function(answer, index) {
                    if(!$('#answer' + index)) {
                        $scope.addAnswer();
                    }
                    
                });
            })
        } else if (loc === 'cq') {
            taggingService.resetTags();
            taggingService.addTag("Technical");
            $scope.tags = taggingService.getTags();
            $scope.selectedTags = taggingService.getSelectedTags();
        }

    }
    
    $scope.loadQuestion();
}

