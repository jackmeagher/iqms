/**
 * Created by nick on 4/6/16.
 */

function create_question_controller ($scope,$location,$http,$window, taggingService, popupService) {
    
    $scope.questionText = '';
    $scope.types = taggingService.getTypes();
    $scope.currentTags = [];
    $scope.selectedTags = [];
    $scope.answers = [''];
    $scope.difficulty = 0;
    
    $scope.questionData = {
      text: '',
      type: '',
      tags: [],
      difficulty: 0,
      answers: []
    };
    
    //Type
    
    $scope.updateSelectedType = function(value) {
        taggingService.updateSelectedType(value);
        $scope.currentTags = taggingService.getCurrentTags();
    }

    //Tag
    
    $scope.$on("tagNotification", function(event, args) {
        $scope.currentTags = taggingService.getCurrentTags();
        $scope.selectedTags = taggingService.getSelectedTags();
    });
    
    $scope.removeTag = function(tag) {
        taggingService.removeTag(tag);
        $scope.currentTags = taggingService.getCurrentTags();
        $scope.selectedTags = taggingService.getSelectedTags();
    }
    
    //Answer
    
    $scope.addAnswer = function() {
        $scope.answers.push($scope.answers.length + 1);
    }
    
    $scope.removeAnswer = function() {
        if ($scope.answers.length > 1) {
            $scope.answers.pop();
        }
    }
    
    //Submit
    
    $scope.compileData = function () {
    
        $scope.questionData.text = $scope.questionText;
        $scope.questionData.type = taggingService.getSelectedType().name;
        $scope.questionData.tags = taggingService.getSelectedTags();
        $scope.questionData.difficulty = parseInt($("#diff-input").val());
        $scope.questionData.answers = [];
        $('.answer-box').each(function(index) {
           $scope.questionData.answers.push($(this).val()); 
        });
        
        //Check if we are edit or create
        $scope.createQuestion();
    }
    
    
    //Interaction with question database
    $scope.createQuestion = function () {
        $http.post('/question',  $scope.questionData).success(function(created){
                $window.location.href = './#qm';
            });
    }
    
    $scope.editQuestion = function() {
        $http.put('/question', $scope.questionData).success(function(created) {
           $window.location.href = './#qm'; 
        });
    }
    
    $scope.loadQuestion = function() {
        var loc = "" + $window.location;
        loc = loc.substr(loc.lastIndexOf('/') + 1, 2);
        var id = $window.location.hash.substr(5);
        if (loc === 'ce') {
            console.log('EDIT PAGE: ' + id);
            $http.get('/question/' + id).success(function(data) {
                console.log(data);
                $('#question_text').val(data.question.text);
                taggingService.updateSelectedTypeByName(data.question.type);
                console.log(taggingService.getSelectedType());               
                $('#question-type').val(data.question.type);
                $("#topic-box").css({"visibility": "visible"});
                $("#subtopic-box").css({"visibility": "visible"});
                data.question.tags.forEach(function(tag, index) {
                   taggingService.addTag(tag); 
                });
                $scope.currentTags = taggingService.getCurrentTags();
                $scope.selectedTags = taggingService.getSelectedTags();
                $('#modelValue').val(data.question.difficulty);
                $scope.answers = data.question.answers;
                data.question.answers.forEach(function(answer, index) {
                    if(index > 0) {
                        $scope.addAnswer();
                    }
                    
                });
            })
        }

    }
    
    $scope.loadQuestion();
}

