/**
 * Created by nick on 4/6/16.
 */

function create_question_controller ($scope,$location,$http,$window, taggingService, popupService) {
    
    $scope.questionText = '';
    $scope.types = taggingService.getTypes();
    $scope.currentTags = [];
    $scope.answers = [''];
    
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
        $("#subtopic-box").css({"visibility": "hidden"});
        $scope.currentTags = taggingService.getCurrentTags();
    }

    //Tag
    
    $scope.$on("topicNotification", function(event, args) {
        $scope.currentTags = taggingService.getCurrentTags();
    });
    
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
        //Grab Tags Here
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
                taggingService.updateSelectedTopicByName(data.question.topic);
                $('#question-topic').find('input').val(data.question.topic);
                $("#topic-box").css({"visibility": "visible"});
                $("#subtopic-box").css({"visibility": "visible"});
                $scope.current_subtopics = taggingService.getCurrentSubTopics();
                console.log($scope.current_subtopics);
                $('.question-sub').each(function(index, el) {
                    var box = $(this);
                    data.question.subtopics.forEach(function(sub, index) {
                        if (box.data("name") == sub){
                            box.prop("checked", true);     
                        } 
                    });
                });
            })
        }

    }
}

