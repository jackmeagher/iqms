function create_interview_controller($scope, $http, $window, taggingService, popupService) {
    $scope.current_questions  = [];     // set the default search/filter term

    $scope.positions = {"Test": {id: 0, position: "Test", description: "A test description"}};
    $scope.selectedPosition = null;
    $scope.positionText = "";
    
    $scope.candidates = {"Hunter Heidenreich": {id: 0, name: "Hunter Heidenreich"}};
    $scope.selectedCandidate = null;
    $scope.candidateText = "";
    
    $scope.tags = ['Technical', 'Test', 'First', 'Last'];
    $scope.addTag = false;
    
    $scope.$on('current_position', function (event, data) {
        $scope.cur_pos = data.display;
    });
    $scope.$on('current_interviewee', function (event, data) {
        $scope.cur_int = data.item.first_name + " " + data.item.last_name;
    });

    $scope.addQuestion = function(question){
        if ($scope.current_questions.indexOf(question) < 0){
        $scope.current_questions.push(question.item);
    }};

    $scope.CreateInterview = function () {


        var par1 = {interviewee: $scope.cur_int, label: $scope.cur_pos};

        $http.post('/interview', par1).success(function (posted) {
            addQuestions(posted.interview.id);
            $window.location.href = './#li';

        })
    };

    var addQuestions = function(id){
        $scope.current_questions.forEach(q => $http.post('/interview/' + id + '/questions/' + q.id));
        $scope.current_questions.forEach(q => $http.post('/answer/',{interviewId : id, questionId: q.id}));
    };

    
    $scope.getTagCount = function(tag) {
        return taggingService.countTag(tag);
    }
    
   /* $scope.addPosition = function() {
        popupService.init("Add a Position", "Add a new position", "" ,"");
        popupService.showPrompt(this, function() {
            $scope.positions.push({id: $scope.positions.length, position: popupService.getResult()});
            popupService.init("Description", "Add job description for " + popupService.getResult(), "" ,"");
            popupService.showPrompt(this, function() {
               $scope.positions[$scope.positions.length - 1].description = popupService.getResult(); 
            });
        });
        
    }*/
    
    taggingService.resetTags();
    
    
    $scope.addPosition = function(position) {
        if (position && !$scope.positions[position]) {
            $scope.positions[position] = {id: 0, position: position, description: ""};
            popupService.init("Description", "Add job description for " + position, "" ,"");
            popupService.showPrompt(this, function() {
                $scope.positions[position].description = popupService.getResult();
                $scope.selectedPosition = position;
            });
        }
    }
    
    $scope.queryPosition = function(query) {
        var pos = $.map($scope.positions, function(value, index) {
           return value.position; 
        });
        if (query == null) {
            query = "";
        }
        text = query.toLowerCase();
        var ret = pos.filter(function(d) {
           var test = d.toLowerCase();
           return test.startsWith(text);
        });
        return ret;
    }
    
    $scope.positionTextChange = function(text) {
        var pos = $.map($scope.positions, function(value, index) {
            return value.position; 
        }); 
    }
    
    $scope.positionItemChange = function(item) {
        if (item) {
            $scope.selectedPosition = item;
        }
    }
    
    $scope.addCandidate = function(candidate) {
        if (candidate && !$scope.candidates[candidate]) {
            $scope.candidates[candidate] = {id: 0, name: candidate};
            $scope.selectedCandidate = candidate;
        }
    }
    
    $scope.queryCandidate = function(query) {
        var can = $.map($scope.candidates, function(value, index) {
           return value.name; 
        });
        if (query == null) {
            query = "";
        }
        text = query.toLowerCase();
        var ret = can.filter(function(d) {
           var test = d.toLowerCase();
           return test.startsWith(text);
        });
        return ret;
    }
    
    $scope.candidateTextChange = function(text) {
        var pos = $.map($scope.candidates, function(value, index) {
            return value.name; 
        });
    }
    
    $scope.candidateItemChange = function(item) {
        if (item) {
            $scope.selectedCandidate = item;
        }
    }
}

