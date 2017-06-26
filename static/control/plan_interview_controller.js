function plan_interview_controller($scope, $http, $mdDialog, $routeParams,
                                   $rootScope, $location, taggingService,
                                   flaggingService, authService) {

    var interviewID = $routeParams.id;

    $scope.positionText = "";
    $scope.positionDescription = "";
    $scope.candidateText = "";
    $scope.dateText = "";
    $scope.locationText = "";

    $scope.taglist = [];
    $scope.selectedTag = null;
    $scope.tagText = "";

    var loadScreen = function() {
        authService.getUserToken(function(idToken) {
            flaggingService.clearQuestions();
            flaggingService.loadQuestionList(interviewID);
            $http.get('../../interview/' + interviewID + "?idToken=" + idToken).success(function(data) {
                loadCandidatePosition(idToken, data.interview.candidatePositionCId);
                loadTags(idToken);
                $scope.dateText = data.interview.date;
                $scope.locationText = data.interview.location;
            });
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

    var loadPosition = function(idToken, id) {
        $http.get('../../position/' + id + "?idToken=" + idToken).success(function(result) {
            $scope.positionText = result.position.name;
            $scope.positionText += getPositionID({type: "Internal", info: result.position});
            $scope.positionDescription = result.position.description;
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

    var loadTags = function(idToken) {
        $http.get('../../interview/' + interviewID + '/tags?idToken=' + idToken).success(function(data) {
            data.tags.forEach(function(tag, index) {
                $('#tagbox').tagsinput('add', tag.name);
            });
        })
    };

    $scope.createInterview = function () {
        $scope.saveInterview(interviewID);
    };

    $scope.saveInterview = function(interviewID) {
        flaggingService.persistQuestions(interviewID);
        $location.path('/li');
        authService.getUserToken(function(idToken) {
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

    $rootScope.$on('tagNotification', function() {
        $('#tagbox').on('beforeItemAdd', beforeTagAdd);
        $('#tagbox').on('beforeItemRemove', beforeTagRemove);
        $scope.tagList = taggingService.getTags();
    });

    $scope.cancel = function() {
      $location.path('/li');
    };

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