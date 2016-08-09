function conduct_interview_controller ($scope,$rootScope,$http,$mdMedia, $mdDialog, $routeParams,$filter, filterService, socket, toast, userService) {
    var interviewId = $routeParams.id;
    filterService.setInterviewId(interviewId);
    $scope.interview = {};
    $scope.questionList = {};
    $scope.questionsByID = {};

    $scope.previousQuestions = [];
    $scope.lastQuestion = null;
    $scope.currentQuestion = {};
    $scope.queuedQuestions = [];

    $scope.interviewerName = userService.getUserName();

    $scope.state = 0;

    $scope.recommendation = 0;

    $scope.collapseQuestion = function (id) {
        $('.collapse-prev').collapse('hide');
        $('#collapse' + id).collapse('toggle');
    }

    $scope.respond = function (id, value) {
        var feedback = {
            user: $scope.interviewerName,
            rating: value,
            question_id: id
        };
        var creating = false;
        if ($scope.currentQuestion.id == id) {
            socket.emit('question-feedback', {interviewId: interviewId, user: $scope.interviewerName});
            $scope.currentQuestion.response = value;
            feedback.note = $scope.currentQuestion.note;
            creating = true;
        } else if ($scope.lastQuestion.id == id) {
            $scope.lastQuestion.response = value;
            feedback.note = $scope.lastQuestion.note;
        } else {
            var index;
            for (var i = 0; i < $scope.previousQuestions.length; i++) {
                if ($scope.previousQuestions[i].id == id) {
                    $scope.previousQuestions[i].response = value;
                    index = i;
                    i = $scope.previousQuestions.length;
                }
            }
            feedback.note = $scope.previousQuestions[index].note;
        }
        $scope.recordFeedback(feedback, creating);
    }

    $scope.skip = function (id) {
        socket.emit('question-skip', {id: id, interviewId: interviewId, user: $scope.interviewerName});
        $scope.respond(id, -1);
    }

    $scope.recordFeedback = function (feedback, creating) {
        if (creating) {
            $http.post('/feedback', feedback).then(function (created) {
                $http.post('/interview/' + interviewId + '/feedback/' + created.data.feedback.id).then(function (added) {
                });
            });
        } else {
            $http.get('/interview/' + interviewId + '/feedback/' + feedback.question_id).then(function (feedbacks) {
                $http.put('/feedback/' + feedbacks.data.feedbacks[0].id, feedback).then(function (update) {
                });
            });
        }
    }

    $scope.pullQuestion = function () {
        var difficulties = filterService.getDifficulties();
        var tags = filterService.getTags();
        var qsId = $.map($scope.questionsByID, function (value, index) {
            return value;
        });
        qsId = $filter('filter')(qsId, function (question) {
            if(question.tags['Inline']) {
                return false;
            }

            if ($scope.state == 0) {
                return !question.queued && question.tags["Intro"];
            } else if ($scope.state == 1) {
                if (question.tags["Intro"] || question.tags["Close"]) {
                    return false;
                }

                if (!difficulties[0].checked && question.difficulty <= 3) {
                    return false
                } else if (!difficulties[1].checked && question.difficulty > 3 && question.difficulty <= 6) {
                    return false;
                } else if (!difficulties[2].checked && question.difficulty > 6) {
                    return false
                }

                var del = false;
                tags.forEach(function (tag, index) {
                    if (!tag.checked && question.tags[tag.label]) {
                        del = true;
                    }
                });

                if (del) {
                    return false;
                }

                del = false;
                for (var i = 0; i < tags.length; i++) {
                    if (tags[i].checked && question.tags[tags[i].label]) {
                        del = true;
                        i = tags.length;
                    }
                }
                return !question.queued && del;
            } else {
                return !question.queued && question.tags["Close"];
            }
        });

        if ($scope.state == 1) {
            qsId = $filter('orderTechnicalQuestions')(qsId, filterService.getOrderBy(), filterService.getTags(), false);
        }

        if (qsId.length > 0) {
            $scope.queuedQuestions.push(qsId[0]);
            $scope.questionsByID[qsId[0].id].queued = true;
        }
    }

    $scope.sendQuestionOrder = function () {
        $scope.queuedQuestions[0].test = false;
        socket.emit('question-reorder', {
            queue: $scope.queuedQuestions,
            interviewId: interviewId,
            user: $scope.interviewerName
        });
    }

    $scope.difficultyMap = function (num) {
        if (num <= 3) {
            return "Junior";
        } else if (num <= 6) {
            return "Mid";
        }
        return "Senior";
    }

    $scope.changeState = function (add) {
        socket.emit('change-state', {interviewId: interviewId, state: add});
    }

    $scope.endInterview = function () {
        $http.get('/interview/' + interviewId).success(function (data) {
            $scope.interview = data.interview;
            $scope.interview.conducted = true;
            $scope.interview.user = $scope.interviewerName;
            $scope.interview.recommendation = $scope.recommendation;
            $http.put('/interview/' + interviewId, $scope.interview).success(function (data) {
                window.location.href = '#/';
            });
        });
    }

    $scope.swapQuestion = function (index) {
        var temp = $scope.queuedQuestions[index];
        $scope.queuedQuestions[index] = $scope.currentQuestion;
        $scope.currentQuestion = temp;
    }

    $scope.addQuestion = function(ev) {
        var useFullScreen = ($mdMedia('xs') || $mdMedia('sm') || $mdMedia('md') || $mdMedia('lg') || $mdMedia('xl'));
        console.log(useFullScreen);
        $mdDialog.show({
            controller: DialogController,
            controllerAs: 'diag',
            templateUrl: 'createQuestion.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen
        })
            .then(function(question) {
                //$scope.status = 'You said the information was "' + question + '".'
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        $scope.$watch(function() {
            return $mdMedia('xl');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = true;
        });
    }

    $rootScope.$on('interviewQuestion', function(event, data) {
       $scope.addQuestionToQueue(data);
    });

    $scope.addQuestionToQueue = function(question) {
        if(question.id) {
            $scope.currentQuestion.queued = false;
            $scope.currentQuestion = question;
            $scope.questionsByID[question.id] = question;
            $scope.questionsByID[question.id].queued = true;
            $scope.questionsByID[question.id].tags = {};
        }

        console.log(question);
    }

    var loadPreviousFeedbacks = function() {
        $http.get('/interview/' + interviewId + '/feedback/').then(function(feedbacks) {
            var savedFeedbacks = feedbacks.data.feedbacks;
            savedFeedbacks.forEach(function(f, index) {
                $scope.questionsByID[f.question_id].queued = true;
                if(f.data[$scope.interviewerName]) {
                    $scope.questionsByID[f.question_id].response = f.data[$scope.interviewerName].rating;
                    if(f.data[$scope.interviewerName].note) {
                        $scope.questionsByID[f.question_id].note = f.data[$scope.interviewerName].note;
                    }
                }
                $scope.previousQuestions.push($scope.questionsByID[f.question_id]);

                $scope.queuedQuestions.forEach(function (q, index) {
                    $scope.questionsByID[q.id].queued = false;
                });
                $scope.queuedQuestions = [];
                if ($scope.currentQuestion && $scope.currentQuestion.id) {
                    $scope.questionsByID[$scope.currentQuestion.id].queued = false;
                }
                $scope.currentQuestion = {};
            });
            $scope.lastQuestion = $scope.previousQuestions.pop();
            console.log($scope.queuedQuestions);
            $rootScope.$emit('updateFilter');
        });
    }

    $rootScope.$on('updateFilter', function () {
        console.log($scope.queuedQuestions);
        $scope.queuedQuestions.forEach(function (q, index) {
            $scope.questionsByID[q.id].queued = false;
        });
        if ($scope.currentQuestion && $scope.currentQuestion.id) {
            $scope.questionsByID[$scope.currentQuestion.id].queued = false;
        }
        $scope.queuedQuestions = [];
        for (var i = 0; i < 6; i++) {
            $scope.pullQuestion();
        }
        $scope.currentQuestion = $scope.queuedQuestions.shift();
    });

    socket.on('notify-change-state' + interviewId, function (data) {
        $scope.$apply(function () {
            $scope.state += data.state;
            $rootScope.$emit('updateFilter');
        });
    });

    socket.on('notify-question-reorder' + interviewId, function (data) {
        if (data.user == $scope.interviewerName && data.queue[0].test) {
            $scope.queuedQuestions = data.queue;
        } else if (data.user == $scope.interviewerName) {
            $scope.queuedQuestions[0].test = true;
            socket.emit('question-reorder', {
                queue: $scope.queuedQuestions,
                interviewId: interviewId,
                user: $scope.interviewerName
            });
        } else {
            $scope.queuedQuestions = data.queue;
        }
        $scope.$apply();
    });

    socket.on('notify-update-filter' + interviewId, function (data) {
        $scope.$apply(function () {
            filterService.setTags(data.tags);
            console.log(data.tags);
            filterService.setDifficulties(data.difficulties);
            filterService.setOrderBy(data.order);
            toast.info(data.message);
            $rootScope.$emit('updateFilter');
        });
    });

    socket.on('notify-question-skip' + interviewId, function (data) {
        $scope.$apply(function () {
            toast.info(data.message);
            if ($scope.currentQuestion.id == data.id) {
                $scope.currentQuestion.skipped = true;
            } else if ($scope.lastQuestion.id == data.id) {
                $scope.lastQuestion.skipped = true;
            } else {
                var index;
                for (var i = 0; i < $scope.previousQuestions.length; i++) {
                    if ($scope.previousQuestions[i].id == data.id) {
                        $scope.previousQuestions[i].skipped = true;
                        i = $scope.previousQuestions.length;
                    }
                }
            }
        });
    });

    socket.on('notify-question-feedback' + interviewId, function (data) {
        $scope.$apply(function () {
            if ($scope.lastQuestion) {
                $scope.previousQuestions.push($scope.lastQuestion);
            }
            $scope.lastQuestion = $scope.currentQuestion;
            if ($scope.queuedQuestions.length >= 1) {
                $scope.currentQuestion = $scope.queuedQuestions.shift();
                $scope.currentQuestion.response = null;
            } else {
                $scope.currentQuestion = null;
            }
            $scope.pullQuestion();
        });
    });

    socket.on('notify-request-interview' + interviewId, function(data) {
        if(data.interviewerName != $scope.interviewerName) {
            console.log($scope.queuedQuestions);
            var prev = [];
            $scope.previousQuestions.forEach(function(q, index) {
               prev.push(q.id);
            });
            var queued = [];
            $scope.queuedQuestions.forEach(function(q, index) {
                queued.push(q.id);
            });
            var interview = {
                prev: prev,
                last: $scope.lastQuestion.id,
                cur: $scope.currentQuestion.id,
                queued: queued,
                id: interviewId
            };
            socket.emit('broadcast-interview', interview);
        }
    });

    socket.on('notify-broadcast-interview' + interviewId, function(data) {
        if($scope.currentQuestion.id != data.cur) {
            $scope.previousQuestions = [];
            data.prev.forEach(function(num, index) {
                $scope.questionsByID[num].queued = true;
                $scope.previousQuestions.push($scope.questionsByID[num]);
            });
            $scope.questionsByID[data.last].queued = true;
            $scope.lastQuestion = $scope.questionsByID[data.last];
            $scope.questionsByID[data.cur].queued = true;
            $scope.currentQuetsion = $scope.questionsByID[data.cur];
            data.queued.forEach(function(num, index) {
                $scope.questionsByID[num].queued = true;
                $scope.queuedQuestions.push($scope.questionsByID[num]);
            });
        }
        $scope.$apply();
    });

    $http.get('/interview/' + interviewId).success(function (data) {
        $scope.interview = data.interview;
        $http.get('/interview/' + interviewId + '/tags/').success(function (result) {
            var tags = [],
                tagPromises = [];
            result.tags.forEach(function (tag, index) {
                var tagPromise;
                if (tag.name != "Intro" && tag.name != "Skills" && tag.name != "Close") {
                    tags.push({
                        label: tag.name,
                        checked: true
                    });
                }
                $scope.questionList[tag.name] = [];
                tagPromise = $http.get('/tag/' + tag.name + '/questions/').success(function (res) {
                    $scope.questionList[tag.name] = res.questions;
                    $scope.questionList[tag.name].forEach(function (q, index) {
                        if (!$scope.questionsByID[q.id]) {
                            $scope.questionsByID[q.id] = q;
                            $scope.questionsByID[q.id].queued = false;
                            $scope.questionsByID[q.id].tags = {};
                        }
                        $scope.questionsByID[q.id].tags[tag.name] = true;
                    });
                });
                tagPromises.push(tagPromise);
            });
            Promise.all(tagPromises).then(function (result) {
                filterService.setTags(tags);
                $scope.$apply();
                $rootScope.$emit('updateFilter');
                if($scope.interview.started) {
                    loadPreviousFeedbacks();
                    socket.emit('request-interview', {id: interviewId, interviewerName: $scope.interviewerName});
                } else {
                    $scope.interview.started = true;
                    $http.put('/interview/' + interviewId, $scope.interview).success(function() {

                    });
                }
            });

        });
    });
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