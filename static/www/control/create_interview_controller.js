function create_interview_controller($scope, $http, $mdDialog, $mdMedia, $window, taggingService, popupService, flaggingService, userService, authService) {
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
    $scope.userText;
    $scope.addedList = [];

    $scope.userRole = userService.getUserRole();
    
    $scope.loadScreen = function() {
        authService.getUserToken(function(idToken) {
            flaggingService.clearQuestions();
            $http.get('/candidate?idToken=' + idToken).success(function(data) {
                data.candidates.forEach(function(candidate, index) {
                    var fullName = candidate.name + getCandidateID({type: "Internal", info: candidate});
                    $scope.candidates[fullName] = candidate;
                    $scope.candidates[fullName].name = fullName;
                });
            });
            $http.get('/position?idToken=' + idToken).success(function(data) {
                data.positions.forEach(function(position, index) {
                    var fullName = position.name + getPositionID({type: "Internal", info: position});
                    $scope.positions[fullName] = position;
                    $scope.positions[fullName].name = fullName;
                });
            });

            $http.get('/user/?idToken=' + idToken).success(function(users) {
                users.users.forEach(function(user, index) {
                    $scope.userList.push(user.name);
                });
            });
            
        });
    }
    
    $scope.createInterview = function () {
        authService.getUserToken(function(idToken) {
            $http.post('/interview?idToken=' + idToken).success(function(created) {
                $scope.saveInterview(created.interview.id);
            });
        });
    };
    
    $scope.saveInterview = function(interviewID) {
        authService.getUserToken(function(idToken) {
            flaggingService.persistQuestions(interviewID);
            $scope.addedList.forEach(function(name, index) {
                $http.post('/interview/' + interviewID + '/user/' + name + "?idToken=" + idToken).success(function(added) {

                });
            });

            $http.post('/candidate/' + $scope.candidates[$scope.selectedCandidate].id
                + '/position/' + $scope.positions[$scope.selectedPosition].id + "?idToken=" + idToken)
                .success(function() {
                    $http.get('/candidatePosition/' + $scope.candidates[$scope.selectedCandidate].id
                        + '/position/' + $scope.positions[$scope.selectedPosition].id + "?idToken=" + idToken)
                        .success(function(canPos) {
                            var candidatePositionID = canPos.candidatePosition.c_id;
                            var interviewData = {
                                candidatePositionCId: candidatePositionID,
                                date: $scope.dateText,
                                location: $scope.locationText
                            };
                            $http.put('/interview/' + interviewID + "?idToken=" + idToken, interviewData).success(function(updated) {
                                $window.location.href = './#li';
                                $scope.checkForMainTags(interviewID);
                            });
                        });
                });
        });

    }
    
    $scope.addPosition = function(position) {
        if (position && !$scope.positions[position]) {
            $scope.positions[position] = {name: position, description: ""};
            popupService.init("Description", "Add job description for " + position, "" ,"");
            popupService.showPrompt(this, function() {
                $scope.positions[position].description = popupService.getResult();
                $scope.selectedPosition = position;
                authService.getUserToken(function(idToken) {
                    $http.post('/position?idToken=' + idToken, $scope.positions[position]).success(function(created) {
                        var fullName = position + getPositionID({type: "Internal", info: created.data});
                        $scope.positions[fullName] = created.data;
                        $scope.positions[fullName].name = fullName;
                        $scope.selectedPosition = fullName;
                        delete $scope.positions[position];
                    });
                });
            });
        }
    }
    
    $scope.queryPosition = function(query) {
        var pos = $.map($scope.positions, function(value, index) {
           return value.name; 
        });

        return $scope.queryFunction(query, pos);
    }
    
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

    $scope.queryUser = function(query) {
        return $scope.queryFunction(query, $scope.userList);
    }

    $scope.userTextChange = function(text) {

    }

    $scope.userItemChange = function(user) {
        if(user) {
            $scope.selectedUser = user;
            $scope.addUser();
        }
    }

    $scope.addCandidate = function(candidate) {
        if (candidate && !$scope.candidates[candidate]) {
            $scope.candidates[candidate] = {name: candidate};
            $scope.selectedCandidate = candidate;
            authService.getUserToken(function(idToken) {
                $http.post('/candidate?idToken=' + idToken, $scope.candidates[candidate]).success(function(created) {
                    var fullName = candidate + getCandidateID({type: "Internal", info: created.data});
                    $scope.candidates[fullName] = created.data;
                    $scope.candidates[fullName].name = fullName;
                    $scope.selectedCandidate = fullName;
                    delete $scope.candidates[candidate];
                });
            });
        }
    }
    
    $scope.queryCandidate = function(query) {
        var can = $.map($scope.candidates, function(value, index) {
           return value.name; 
        });
        
        return $scope.queryFunction(query, can);
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
        console.log("Removed");
        if (loc.location === 'ie') {
            var interviewID = loc.id;
            authService.getUserToken(function(idToken) {
                $http.delete('/tag/' + event.item
                    + '/interview/' + interviewID + "?idToken=" + idToken).success(function(created) {
                });
            });
        }
        if($scope.taglist.indexOf(event.item) > -1) {
            $scope.taglist.splice($scope.taglist.indexOf(event.item), 1);
        }
    });
    
    $scope.checkForMainTags = function(interviewID) {
        authService.getUserToken(function(idToken) {
            var skillTag = false;
            var introTag = false;
            var closeTag = false;
            $scope.taglist.forEach(function(tag, index) {
                if (taggingService.countTag(tag) > 0) {
                    $http.post('/tag/' + tag
                        + '/interview/' + interviewID + "?idToken=" + idToken).success(function(created) {
                    });
                }
                if (tag == "Intro") {
                    introTag = true;
                } else if (tag == "Skills") {
                    skillTag = true;
                } else if (tag == "Close") {
                    closeTag = true;
                }
            });
            if (!introTag) {
                $http.post('/tag/' + "Intro"
                    + '/interview/' + interviewID + "?idToken=" + idToken).success(function(created) {
                });
            }
            if (!skillTag) {
                $http.post('/tag/' + "Skills"
                    + '/interview/' + interviewID + "?idToken=" + idToken).success(function(created) {
                });
            }
            if (!closeTag) {
                $http.post('/tag/' + "Close"
                    + '/interview/' + interviewID + "?idToken=" + idToken).success(function(created) {
                });
            }
        });
    }

    $scope.addUser = function() {
        if($scope.addedList.indexOf($scope.selectedUser) < 0) {
            $scope.addedList.push($scope.selectedUser);
        }
    }

    $scope.removeUser = function(name) {
        if($scope.addedList.indexOf(name) > -1) {
            $scope.addedList.splice($scope.addedList.indexOf(name), 1);
        }
    }

    var getCandidateID = function(options) {
        switch(options.type) {
            default:
            case("Internal"):
                var year = options.info.createdAt.substr(0, 4);
                return formatID(options.info.id, year);
        }
    }

    var getPositionID = function(options) {
        switch(options.type) {
            default:
            case("Internal"):
                var year = options.info.createdAt.substr(0, 4);
                return formatID(options.info.id, year);
        }
    }

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
    }

    taggingService.resetTags();
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