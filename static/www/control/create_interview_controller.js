function create_interview_controller($scope, $http, $mdDialog, $mdMedia, $window, taggingService, popupService, flaggingService) {

    $scope.positions = {};
    $scope.selectedPosition = null;
    $scope.positionText = "";
    
    $scope.candidates = {};
    $scope.selectedCandidate = null;
    $scope.candidateText = "";
    
    $scope.interviewers = {};
    $scope.selectedInterviewer = null;
    $scope.interviewerText = "";
    
    $scope.taglist = [];
    
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
        
        $http.get('/interviewer').success(function(data) {
            data.interviewers.forEach(function(interviewer, index) {
               $scope.interviewers[interviewer.name] = interviewer; 
            });
        });
    }
    
    $scope.createInterview = function () {
        $http.post('/interview').success(function(created) {
            console.log(created);
            var interviewID = created.interview.id;
            flaggingService.persistQuestions(interviewID);
            $http.post('/candidate/' + $scope.candidates[$scope.selectedCandidate].id
                   + '/position/' + $scope.positions[$scope.selectedPosition].id)
            .success(function() {
                $http.get('/candidatePosition/' + $scope.candidates[$scope.selectedCandidate].id
                   + '/position/' + $scope.positions[$scope.selectedPosition].id)
                .success(function(canPos) {
                    console.log(canPos);
                    var candidatePositionID = canPos.candidatePosition.c_id;
                    var interviewData = {
                      candidatePositionCId: candidatePositionID,
                      interviewerId: $scope.interviewers[$scope.selectedInterviewer].id
                    };
                    $http.put('/interview/' + interviewID, interviewData).success(function(updated) {
                        console.log(updated);
                        $scope.taglist.forEach(function(tag, index) {
                            if (taggingService.countTag(tag) > 0) {
                                $http.post('/tag/' + tag
                                       + '/interview/' + interviewID).success(function(created) {
                                    console.log(created);
                                    $window.location.href = './#li'; 
                                });
                            }
                            
                        });
                        
                    });
                });
            });
        });
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
            console.log($scope.candidates);
            console.log($scope.selectedCandidate);
        }
    }
    
    $scope.addInterviewer = function(interviewer) {
        if (interviewer && !$scope.interviewers[interviewer]) {
            $scope.interviewers[interviewer] = {name: interviewer};
            $scope.selectedInterviewer = interviewer;
            $http.post('/interviewer', $scope.interviewers[interviewer]).success(function(created) {
               $scope.interviewers[interviewer].id = created.data.id;
            });
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
    
    
    $scope.showInterviewWithTag = function(ev, tag) {
        taggingService.setClickedTag(tag);
        if (taggingService.countTag(tag) > 0) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'questionFlagger.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
            $scope.$watch(function() {
              return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
              $scope.customFullscreen = (wantsFullScreen === true);
            });
        }
    }
    
    $('#tagbox').on('beforeItemAdd', function(event) {
        event.itemValue = taggingService.countTag(event.item);
        event.itemText = event.item + " (" + event.itemValue + ")";
        $scope.taglist.push(event.item);
        console.log($scope.taglist);
    });
    
    $('#tagbox').on('beforeItemRemove', function(event) {
        if($scope.taglist.indexOf(event.item) > -1) {
            $scope.taglist.splice($scope.taglist.indexOf(event.item), 1);
        }
    });

    
    $scope.loadScreen();
}

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}