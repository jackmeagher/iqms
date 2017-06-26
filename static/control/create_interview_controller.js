function create_interview_controller($scope, $http, $mdDialog, $location,
                                     taggingService, popupService, flaggingService,
                                     userService, authService, $rootScope) {

    $scope.positions = {};
    $scope.selectedPosition = null;
    $scope.positionText = "";

    $scope.candidates = {};
    $scope.selectedCandidate = null;
    $scope.candidateText = "";

    $scope.dateText = "";
    $scope.locationText = "";

    $scope.taglist = [];
    $scope.selectedTag = null;
    $scope.tagText = "";

    $scope.userList = [];
    $scope.selectedUser = "";
    $scope.addedList = [];

    $scope.userRole = userService.getUserRole();

    var interviewID = 0;

    var loadScreen = function() {
        authService.getUserToken(function(idToken) {
            flaggingService.clearQuestions();
            loadCandidates(idToken);
            loadPositions(idToken);
            loadUsers(idToken);
            if($location.hash() && $location.hash() > 0) {
                loadInterview(idToken, $location.hash());
            }
        });
    };

    var loadCandidates = function(idToken) {
        $http.get('../../candidate?idToken=' + idToken).success(function(data) {
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
        $http.get('../../position?idToken=' + idToken).success(function(data) {
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
        $http.get('../../user/?idToken=' + idToken).success(function(users) {
            users.users.forEach(function(user) {
                $scope.userList.push(user.name);
            });
        });
    };

    var loadInterview = function(idToken, id) {
        interviewID = id;
        $http.get('../../interview/' + interviewID + "?idToken=" + idToken).success(function(data) {
            loadCandidatePosition(idToken, data.interview.candidatePositionCId);
            loadTags(idToken);
            loadAddedUsers(idToken, id);
            $scope.dateText = data.interview.date;
            $scope.locationText = data.interview.location;
        });
    };

    var loadCandidatePosition = function(idToken, id) {
        $http.get('../../candidatePosition/' + id + "?idToken=" + idToken).success(function(result) {
            loadCandidate(idToken, result.result.candidateId);
            loadPosition(idToken, result.result.positionId);
        });
    };

    var loadCandidate = function(idToken, id) {
        $http.get('../../candidate/' + id + "?idToken=" + idToken).success(function(result) {
            $scope.candidateText = result.candidate.name;
            $scope.candidateText += getCandidateID({type: "Internal", info: result.candidate});
            $scope.selectedCandidate = $scope.candidateText;
        });
    };

    var loadPosition = function(idToken, id) {
        $http.get('../../position/' + id + "?idToken=" + idToken).success(function(result) {
            $scope.positionText = result.position.name;
            $scope.positionText += getPositionID({type: "Internal", info: result.position});
            $scope.selectedPosition = $scope.positionText;
            $scope.positionDescription = result.position.description;
        });
    };

    var loadTags = function(idToken) {
        $http.get('../../interview/' + interviewID + '/tags?idToken=' + idToken).success(function(data) {
            data.tags.forEach(function(tag) {
          
                $('#tagbox').tagsinput('add', tag.name);
            });
        })
    };

    var loadAddedUsers = function(idToken, id) {
        $http.get('../../interview/' + id + '/users/?idToken=' + idToken).success(function(data) {
            data.users.forEach(function(user) {
                $scope.addedList.push(user.name);
            });
        });
    };

    $scope.createInterview = function () {
        authService.getUserToken(function(idToken) {
            if(interviewID == 0 || !$location.hash()) {
                $http.post('../../interview?idToken=' + idToken).success(function(created) {
                    saveInterview(created.interview.id, idToken);
                });
            } else {
                saveInterview(interviewID, idToken);
            }
        });
    };

    var saveInterview = function(interviewID, idToken) {
        flaggingService.persistQuestions(interviewID);
        addUsersToInterview(idToken, interviewID);
        createCandidatePosition(idToken, interviewID);
    };

    var addUsersToInterview = function(idToken, interviewID) {
        $scope.addedList.forEach(function(name) {
            $http.post('../../interview/' + interviewID + '/user/' + name + "?idToken=" + idToken).success(function(added) {
            });
        });
    };

    var createCandidatePosition = function(idToken, interviewID) {
        $http.get('../../candidatePosition/' + $scope.candidates[$scope.selectedCandidate].id
            + '/position/' + $scope.positions[$scope.selectedPosition].id + "?idToken=" + idToken)
            .success(function(canPos) {
                if(canPos.candidatePosition) {
                    updateInterviewDetails(idToken, canPos.candidatePosition.c_id, interviewID);
                } else {
                    $http.post('../../candidate/' + $scope.candidates[$scope.selectedCandidate].id
                        + '/position/' + $scope.positions[$scope.selectedPosition].id + "?idToken=" + idToken)
                        .success(function() {
                            $http.get('../../candidatePosition/' + $scope.candidates[$scope.selectedCandidate].id
                                + '/position/' + $scope.positions[$scope.selectedPosition].id + "?idToken=" + idToken)
                                .success(function(canPos) {
                                    updateInterviewDetails(idToken, canPos.candidatePosition.c_id, interviewID);
                                });
                        });
                }
            });
    };

    var updateInterviewDetails = function(idToken, candidatePositionID, interviewID) {
        var interviewData = {
            candidatePositionCId: candidatePositionID,
            date: $scope.dateText,
            location: $scope.locationText
        };
        $http.put('../../interview/' + interviewID + "?idToken=" + idToken, interviewData).success(function(updated) {
            $location.path('/li');
            checkForMainTags(interviewID, idToken);
        });
    };

    var checkForMainTags = function(interviewID, idToken) {
        var mainTags = ['intro', 'skills', 'close'];
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
        $http.post('../../tag/' + tag + '/interview/' + interviewID + "?idToken=" + idToken).success(function(created) {});
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
            $http.post('../../position?idToken=' + idToken, $scope.positions[position]).success(function(created) {
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
            $http.post('../../candidate?idToken=' + idToken, $scope.candidates[candidate]).success(function(created) {
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
            $scope.userText = "";
            $scope.selectedUser = user;
            $scope.addUser();
        }
    };

    $scope.addUser = function() {
        if($scope.addedList.indexOf($scope.selectedUser) < 0) {
            $scope.addedList.push($scope.selectedUser);
            $scope.selectedUser = null;
        }
    };

    $scope.removeUser = function(name) {
        if(interviewID > 0) {
            authService.getUserToken(function(idToken) {
                $http.delete('../../interview/' + interviewID
                    + '/user/' + name + "?idToken=" + idToken).success(function(created) {
                });
            });
        }
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
                clickOutsideToClose:true
            });
        }
    };

    $scope.queryTag = function(query) {
        var pos = $.map($scope.tagList, function(value, index) {
            return value.name;
        });
        pos = removeMainTags(pos);
        pos = removeSelectedTags(pos);
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

    $scope.tagItemChange = function(item) {
        if (item) {
            $scope.selectedTag = item;
            $('#tagbox').tagsinput('add', $scope.selectedTag);
            $scope.selectedTag = null;
            $scope.tagText = "";
        }
    };

    var removeMainTags = function(t) {
        var mainTags = ['intro', 'skills', 'close', 'inline'];
        mainTags.forEach(function(tag) {
            if(t) {
                if(t.indexOf(tag) > -1) {
                    t.splice(t.indexOf(tag), 1);
                }
            }
        });
        return t;
    };

    var removeSelectedTags = function(t) {
        $scope.taglist.forEach(function(tag) {
            if(t.indexOf(tag) > -1) {
                t.splice(t.indexOf(tag), 1);
            }
        });
        return t;
    };

    var beforeTagAdd = function(event) {
        event.item = event.item.toLowerCase();
        event.itemValue = taggingService.countTag(event.item);
        event.itemText = event.item + " (" + event.itemValue + ")";
        $scope.taglist.push(event.item);
    };

    var beforeTagRemove = function(event) {
        if(interviewID > 0) {
            authService.getUserToken(function(idToken) {
                $http.delete('../../tag/' + event.item
                    + '/interview/' + interviewID + "?idToken=" + idToken).success(function(created) {
                });
            });
        }
        if($scope.taglist.indexOf(event.item) > -1) {
            $scope.taglist.splice($scope.taglist.indexOf(event.item), 1);
        }
    };

    $scope.cancel = function() {
        $location.path('/li');
    };

    $rootScope.$on('tagNotification', function() {
        $('#tagbox').on('beforeItemAdd', beforeTagAdd);
        $('#tagbox').on('beforeItemRemove', beforeTagRemove);
        $scope.tagList = taggingService.getTags();
    });

    taggingService.resetTags();
    loadScreen();

    $('#tagbox').on('beforeItemAdd', function(event) {});

    $('#tagbox').on('beforeItemRemove', function(event) {});
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
