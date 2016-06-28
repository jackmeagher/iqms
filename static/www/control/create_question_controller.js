/**
 * Created by nick on 4/6/16.
 */

function create_question_controller ($scope,$location,$http,$window, taggingService) {
    $scope.qt = $location.search().qt;
    $scope.current_topics = [];
    
    $scope.selectedType = 0;
    $scope.selectedTopic = null;
    $scope.types = taggingService.getTypes();

    $scope.answers = [1];
    
    $scope.updateSelectedType = function(value) {
        /*$scope.current_topics = [];
        $scope.types[value.id].topics.forEach(function(topic) {
            console.log(topic.name);
            $scope.current_topics.push(topic.name);
        });
        console.log($scope.current_topics);*/
        taggingService.updateSelectedType(value.id);
    }
    
    $scope.addTag = function(tag){
        if ($scope.current_tags.indexOf(tag) < 0){
            $scope.current_tags.push(tag);
            console.log(tag);
        }};


    self.clear = function(tag){
        $scope.tags = $scope.tag.filter(e => e!==tag);

        //console.log(self.selectedItem);
        self.searchText = undefined;
        self.selectedItem = undefined;
    };



    $scope.CreateQuestion = function () {
        qt = document.getElementById("question_text").value;
        diff = document.getElementById("difficulty").value;

        console.log(qt);
        var par1 = {question_text: qt,difficulty : diff};

        $http.post('/question',par1).success(function(created){
                qid = created.question.id;
                $scope.current_tags.forEach(tag => $http.post('/question/' + qid + '/tags/' + tag.item.id ))
                $window.location.href = './#qm';

            });

    }
    
    $scope.addAnswer = function() {
        $scope.answers.push($scope.answers.length + 1);
        
        console.log($scope.answers);
    }
    
    $scope.removeAnswer = function() {
        if ($scope.answers.length > 1) {
            $scope.answers.pop();
        }
        
        console.log($scope.answers);
    }


}

