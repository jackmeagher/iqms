function create_interview_controller($scope, $http, $mdDialog, $mdMedia, $window, taggingService, popupService, flaggingService) {
    $scope.positions = {};
    $scope.selectedPosition = null;
    $scope.positionText = "";
    
    $scope.candidates = {};
    $scope.selectedCandidate = null;
    $scope.candidateText = "";
    
    $scope.taglist = [];
    
    $scope.loadScreen = function() {
        flaggingService.clearQuestions();
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
        
        var loc = $scope.getWindowLocation();
        if (loc.location === 'ie') {
            flaggingService.loadQuestionList(loc.id);
            $http.get('/interview/' + loc.id).success(function(data) {
                $http.get('/candidatePosition/' + data.interview.candidatePositionCId).success(function(result) {
                    $http.get('/candidate/' + result.result.candidateId).success(function(result) {
                        $scope.candidateItemChange(result.candidate.name);
                    });
                    $http.get('/position/' + result.result.positionId).success(function(result) {
                        $scope.positionItemChange(result.position.name);
                    });
                 });
                $http.get('/interview/' + loc.id + '/tags').success(function(data) {
                    data.tags.forEach(function(tag, index) {
                       $('#tagbox').tagsinput('add', tag.name);
                    });
                })
            });
        }
    }
    
    $scope.createInterview = function () {
        var loc = $scope.getWindowLocation();
        if (loc.location === 'ie') {
            $scope.saveInterview(loc.id);
        } else {
            $http.post('/interview').success(function(created) {
                $scope.saveInterview(created.interview.id);
            });
        }
    };
    
    $scope.saveInterview = function(interviewID) {
        flaggingService.persistQuestions(interviewID);
        $http.post('/candidate/' + $scope.candidates[$scope.selectedCandidate].id
               + '/position/' + $scope.positions[$scope.selectedPosition].id)
        .success(function() {
            $http.get('/candidatePosition/' + $scope.candidates[$scope.selectedCandidate].id
               + '/position/' + $scope.positions[$scope.selectedPosition].id)
            .success(function(canPos) {
                var candidatePositionID = canPos.candidatePosition.c_id;
                var interviewData = {
                  candidatePositionCId: candidatePositionID
                };
                $http.put('/interview/' + interviewID, interviewData).success(function(updated) {
                    $window.location.href = './#li';
                    $scope.checkForMainTags();
                });
            });
        });
    }

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
        }
    }
    
    $scope.getWindowLocation = function() {
        var winLoc = {};
        var loc = "" + $window.location;
        winLoc.location = loc.substr(loc.lastIndexOf('/') + 1, 2);
        winLoc.id = $window.location.hash.substr(5);
        return winLoc;  
    }
    
    $scope.showInterviewWithTag = function(ev, tag) {
        taggingService.setClickedTag(tag);
        flaggingService.setSelectedTag(tag);
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
    });
    
    $('#tagbox').on('beforeItemRemove', function(event) {
        var loc = $scope.getWindowLocation();
        if (loc.location === 'ie') {
            var interviewID = loc.id;
            $http.delete('/tag/' + event.item
                + '/interview/' + interviewID).success(function(created) {
            });
        }
        if($scope.taglist.indexOf(event.item) > -1) {
            $scope.taglist.splice($scope.taglist.indexOf(event.item), 1);
        }
    });
    
    $scope.checkForMainTags = function() {
        var techTag = false;
        var introTag = false;
        var closeTag = false;
        $scope.taglist.forEach(function(tag, index) {
            if (taggingService.countTag(tag) > 0) {
                $http.post('/tag/' + tag
                       + '/interview/' + interviewID).success(function(created) {
                });
            }
            if (tag == "Intro") {
                introTag = true;
            } else if (tag == "Technical") {
                techTag = true;
            } else if (tag == "Close") {
                closeTag = true;
            }
        });
        if (!introTag) {
            $http.post('/tag/' + "Intro"
                       + '/interview/' + interviewID).success(function(created) {
            });
        }
        if (!techTag) {
            $http.post('/tag/' + "Technical"
                       + '/interview/' + interviewID).success(function(created) {
            });
        }
        if (!closeTag) {
            $http.post('/tag/' + "Close"
                       + '/interview/' + interviewID).success(function(created) {
            });
        }
    }
    
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