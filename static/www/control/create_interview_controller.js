function create_interview_controller($scope, $http, $window, taggingService, popupService) {

    $scope.positions = {"Test": {id: 0, name: "Test", description: "A test description"}};
    $scope.selectedPosition = null;
    $scope.positionText = "";
    
    $scope.candidates = {"Hunter Heidenreich": {id: 0, name: "Hunter Heidenreich"}};
    $scope.selectedCandidate = null;
    $scope.candidateText = "";
    
    $scope.interviewers = {"Hunter Scott Heidenreich": {id: 0, name: "Hunter Scott Heidenreich"}};
    $scope.selectedInterviewer = null;
    $scope.interviewerText = "";
    
    $scope.loadScreen = function() {
        $http.get('/position').success(function(data) {
            data.positions.forEach(function(position, index) {
               $scope.positions[position.name] = position;
            });
        });
        
        $http.get('/candidate').success(function(data) {
            data.candidates.forEach(function(candidate, index) {
               $scope.candidates[candidate.name] = candidate; 
            });
        });
    }
    
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
    
    taggingService.resetTags();  
    
    $scope.addPosition = function(position) {
        if (position && !$scope.positions[position]) {
            $scope.positions[position] = {name: position, description: ""};
            popupService.init("Description", "Add job description for " + position, "" ,"");
            popupService.showPrompt(this, function() {
                $scope.positions[position].description = popupService.getResult();
                $scope.selectedPosition = position;
                $http.post('/position', $scope.positions[position]).success(function(created) {
                   $scope.positions[position].id = created.data.id;
                   console.log($scope.positions);
                });
            });
        }
    }
    
    $scope.queryPosition = function(query) {
        var pos = $.map($scope.positions, function(value, index) {
           return value.name; 
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
            return value.name; 
        }); 
    }
    
    $scope.positionItemChange = function(item) {
        if (item) {
            $scope.selectedPosition = item;
        }
    }
    
    $scope.addCandidate = function(candidate) {
        if (candidate && !$scope.candidates[candidate]) {
            $scope.candidates[candidate] = {name: candidate};
            $scope.selectedCandidate = candidate;
            $http.post('/candidate', $scope.candidates[candidate]).success(function(created) {
               $scope.candidates[candidate].id = created.data.id;
               console.log($scope.candidates);
            });
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
    
    $scope.addInterviewer = function(interviewer) {
        if (interviewer && !$scope.interviewers[interviewer]) {
            $scope.interviewers[interviewer] = {id: 0, name: interviewer};
            $scope.selectedInterviewer = interviewer;
        }
    }
    
    $scope.queryInterviewer = function(query) {
        var interv = $.map($scope.interviewers, function(value, index) {
            return value.name;
        });
        if (query == null) {
            query = "";
        }
        text = query.toLowerCase();
        var ret = interv.filter(function(d) {
            var test = d.toLowerCase();
            return test.startsWith(text);
        });
        return ret;
    }
    
    $scope.interviewerTextChange = function(text) {
        var interv = $.map($scope.interviewers, function(value, index) {
            return value.name;
        });
    }
    
    $scope.interviewerItemChange = function(item) {
        if (item) {
            $scope.selectedInterviewer = item;
        }
    }
    
    $('#tagbox').on('itemAddedOnInit', function(event) {
        console.log(event.item);
    });
    $('#tagbox').on('beforeItemAdd', function(event) {
        // event.item: contains the item
        // event.cancel: set to true to prevent the item getting added
        event.itemValue = taggingService.countTag(event.item);
        event.itemText = event.item + " (" + event.itemValue + ")";
    });

    
    $scope.loadScreen();
}

