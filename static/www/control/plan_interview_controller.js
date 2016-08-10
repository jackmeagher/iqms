function plan_interview_controller($scope, $http, $mdDialog, $routeParams, $mdMedia, $window, taggingService, flaggingService, authService) {

    var interviewID = $routeParams.id;

    $scope.positionText = "";
    $scope.positionDescription = "";
    $scope.candidateText = "";
    $scope.dateText = "";
    $scope.locationText = "";

    $scope.taglist = [];

    $scope.loadScreen = function() {
        authService.getUserToken(function(idToken) {
            flaggingService.clearQuestions();
            flaggingService.loadQuestionList(interviewID);
            $http.get('/interview/' + interviewID).success(function(data) {
                $http.get('/candidatePosition/' + data.interview.candidatePositionCId + "?idToken=" + idToken).success(function(result) {
                    $http.get('/candidate/' + result.result.candidateId + "?idToken=" + idToken).success(function(result) {
                        $scope.candidateText = result.candidate.name;
                        $scope.candidateText += getCandidateID({type: "Internal", info: result.candidate});
                    });
                    $http.get('/position/' + result.result.positionId).success(function(result) {
                        $scope.positionText = result.position.name;
                        $scope.positionText += getPositionID({type: "Internal", info: result.position});
                        $scope.positionDescription = result.position.description;
                    });
                });
                $http.get('/interview/' + interviewID + '/tags').success(function(data) {
                    data.tags.forEach(function(tag, index) {
                        $('#tagbox').tagsinput('add', tag.name);
                    });
                })

                $scope.dateText = data.interview.date;
                $scope.locationText = data.interview.location;
            });
        });
    }

    $scope.createInterview = function () {
        $scope.saveInterview(interviewID);
    };

    $scope.saveInterview = function(interviewID) {
        flaggingService.persistQuestions(interviewID);
        $window.location.href = './#li';
        $scope.checkForMainTags(interviewID);
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
        $http.delete('/tag/' + event.item
            + '/interview/' + interviewID).success(function(created) {
        });
        if($scope.taglist.indexOf(event.item) > -1) {
            $scope.taglist.splice($scope.taglist.indexOf(event.item), 1);
        }
    });

    $scope.checkForMainTags = function(interviewID) {
        var skillTag = false;
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
            } else if (tag == "Skills") {
                skillTag = true;
            } else if (tag == "Close") {
                closeTag = true;
            }
        });
        if (!introTag) {
            $http.post('/tag/' + "Intro"
                + '/interview/' + interviewID).success(function(created) {
            });
        }
        if (!skillTag) {
            $http.post('/tag/' + "Skills"
                + '/interview/' + interviewID).success(function(created) {
            });
        }
        if (!closeTag) {
            $http.post('/tag/' + "Close"
                + '/interview/' + interviewID).success(function(created) {
            });
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