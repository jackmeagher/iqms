function create_interview_controller($scope, $http, $mdDialog, $location,
                                     taggingService, popupService, flaggingService,
                                     userService, authService) {

    $scope.positions = {};
    $scope.selectedPosition = null;
    $scope.positionText = "";
    
    $scope.candidates = {};
    $scope.selectedCandidate = null;
    $scope.candidateText = "";

    $scope.dateText = "";
    $scope.locationText = "";

    $scope.taglist = [];

    $scope.userList = [];
    $scope.selectedUser = "";
    $scope.addedList = [];

    $scope.userRole = userService.getUserRole();
    
    var loadScreen = function() {
        authService.getUserToken(function(idToken) {
            flaggingService.clearQuestions();
            loadCandidates(idToken);
            loadPositions(idToken);
            loadUsers(idToken);
        });
    };

    var loadCandidates = function(idToken) {
        $http.get('/candidate?idToken=' + idToken).success(function(data) {
            data.candidates.forEach(function(candidate) {
                var fullName = candidate.name + getCandidateID({type: "Internal", info: candidate});
                $scope.candidates[fullName] = candidate;
                $scope.candidates[fullName].name = fullName;
            });
        });
    };

    var getCandidateID = function(options) {
        switch(options.type) {
            default:
            case("Internal"):
                var year = options.info.createdAt.substr(0, 4);
                return formatID(options.info.id, year);
        }
    };

    var formatID = function(id, year) {
        var formatted = " (#" + year + "-";

        if(id < 10) {
            formatted += "000" + id;
        } else if(id < 100) {
            formatted += "00" + id;
        } else if(id < 1000) {
            formatted += "0" + id;
        } else {
            formatted += id;
        }

        formatted += ")";

        return formatted;
    };

    var loadPositions = function(idToken) {
        $http.get('/position?idToken=' + idToken).success(function(data) {
            data.positions.forEach(function(position, index) {
                var fullName = position.name + getPositionID({type: "Internal", info: position});
                $scope.positions[fullName] = position;
                $scope.positions[fullName].name = fullName;
            });
        });
    };

    var getPositionID = function(options) {
        switch(options.type) {
            default:
            case("Internal"):
                var year = options.info.createdAt.substr(0, 4);
                return formatID(options.info.id, year);
        }
    };

    var loadUsers = function(idToken) {
        $http.get('/user/?idToken=' + idToken).success(function(users) {
            users.users.forEach(function(user, index) {
                $scope.userList.push(user.name);
            });
        });
    };

    $scope.createInterview = function () {
        authService.getUserToken(function(idToken) {
            $http.post('/interview?idToken=' + idToken).success(function(created) {
                saveInterview(created.interview.id, idToken);
            });
        });
    };
    
    var saveInterview = function(interviewID, idToken) {
        flaggingService.persistQuestions(interviewID);
        addUsersToInterview(idToken, interviewID);
        createCandidatePosition(idToken, interviewID);
    };

    var addUsersToInterview = function(idToken, interviewID) {
        $scope.addedList.forEach(function(name) {
            $http.post('/interview/' + interviewID + '/user/' + name + "?idToken=" + idToken).success(function(added) {});
        });
    };

    var createCandidatePosition = function(idToken, interviewID) {
        $http.post('/candidate/' + $scope.candidates[$scope.selectedCandidate].id
            + '/position/' + $scope.positions[$scope.selectedPosition].id + "?idToken=" + idToken)
            .success(function() {
                $http.get('/candidatePosition/' + $scope.candidates[$scope.selectedCandidate].id
                    + '/position/' + $scope.positions[$scope.selectedPosition].id + "?idToken=" + idToken)
                    .success(function(canPos) {
                        updateInterviewDetails(idToken, canPos.candidatePosition.c_id, interviewID);
                    });
            });
    };

    var updateInterviewDetails = function(idToken, candidatePositionID, interviewID) {
        var interviewData = {
            candidatePositionCId: candidatePositionID,
            date: $scope.dateText,
            location: $scope.locationText
        };
        $http.put('/interview/' + interviewID + "?idToken=" + idToken, interviewData).success(function(updated) {
            $location.path('/li');
            checkForMainTags(interviewID, idToken);
        });
    };

    var checkForMainTags = function(interviewID, idToken) {
        var mainTags = ['Intro', 'Skills', 'Close'];
        $scope.taglist.forEach(function(tag) {
            if (taggingService.countTag(tag) > 0) {
                addTagToInterview(idToken, interviewID, tag);
            }
            if(mainTags.indexOf(tag) > -1)
                mainTags.splice(mainTags.indexOf(tag), 1);
        });
        mainTags.forEach(function(tag) {
           addTagToInterview(idToken, interviewID, tag);
        });
    };

    var addTagToInterview = function(idToken, interviewID, tag) {
        $http.post('/tag/' + tag + '/interview/' + interviewID + "?idToken=" + idToken).success(function(created) {});
    };
    
    $scope.addPosition = function(position) {
        if (position && !$scope.positions[position]) {
            $scope.positions[position] = {name: position, description: ""};
            popupService.init("Description", "Add job description for " + position, "" ,"");
            popupService.showPrompt(this, function() {
                $scope.positions[position].description = popupService.getResult();
                $scope.selectedPosition = position;
                savePosition(position);
            });
        }
    };

    var savePosition = function(position) {
        authService.getUserToken(function(idToken) {
            $http.post('/position?idToken=' + idToken, $scope.positions[position]).success(function(created) {
                var fullName = position + getPositionID({type: "Internal", info: created.data});
                $scope.positions[fullName] = created.data;
                $scope.positions[fullName].name = fullName;
                $scope.selectedPosition = fullName;
                delete $scope.positions[position];
            });
        });
    };
    
    $scope.queryPosition = function(query) {
        var pos = $.map($scope.positions, function(value) {
           return value.name; 
        });

        return $scope.queryFunction(query, pos);
    };
    
    $scope.queryFunction = function(query, data) {
        if (query == null) {
            query = "";
        }

        text = query.toLowerCase();
        var ret = data.filter(function(d) {
           var test = d.toLowerCase();
           return test.startsWith(text);
        });
        return ret;
    };
    
    $scope.positionItemChange = function(item) {
        if (item) {
            $scope.selectedPosition = item;
        }
    };

    $scope.addCandidate = function(candidate) {
        if (candidate && !$scope.candidates[candidate]) {
            $scope.candidates[candidate] = {name: candidate};
            $scope.selectedCandidate = candidate;
            saveCandidate(candidate);
        }
    };

    var saveCandidate = function(candidate) {
        authService.getUserToken(function(idToken) {
            $http.post('/candidate?idToken=' + idToken, $scope.candidates[candidate]).success(function(created) {
                var fullName = candidate + getCandidateID({type: "Internal", info: created.data});
                $scope.candidates[fullName] = created.data;
                $scope.candidates[fullName].name = fullName;
                $scope.selectedCandidate = fullName;
                delete $scope.candidates[candidate];
            });
        });
    };

    $scope.queryCandidate = function(query) {
        var can = $.map($scope.candidates, function(value, index) {
            return value.name;
        });

        return $scope.queryFunction(query, can);
    };

    $scope.candidateItemChange = function(item) {
        if (item) {
            $scope.selectedCandidate = item;
        }
    };

    $scope.queryUser = function(query) {
        return $scope.queryFunction(query, $scope.userList);
    };

    $scope.userItemChange = function(user) {
        if(user) {
            $scope.selectedUser = user;
            $scope.addUser();
        }
    };

    $scope.addUser = function() {
        if($scope.addedList.indexOf($scope.selectedUser) < 0) {
            $scope.addedList.push($scope.selectedUser);
        }
    };

    $scope.removeUser = function(name) {
        if($scope.addedList.indexOf(name) > -1) {
            $scope.addedList.splice($scope.addedList.indexOf(name), 1);
        }
    };
    
    $scope.showInterviewWithTag = function(ev, tag) {
        taggingService.setClickedTag(tag);
        flaggingService.setSelectedTag(tag);
        if (taggingService.countTag(tag) > 0) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'questionFlagger.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            });
        }
    };

    $('#tagbox').on('beforeItemAdd', function(event) {
        event.itemValue = taggingService.countTag(event.item);
        event.itemText = event.item + " (" + event.itemValue + ")";
        $scope.taglist.push(event.item);
    });

    $('#tagbox').on('beforeItemRemove', function(event) {
        if($scope.taglist.indexOf(event.item) > -1) {
            $scope.taglist.splice($scope.taglist.indexOf(event.item), 1);
        }
    });

    taggingService.resetTags();
    loadScreen();
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