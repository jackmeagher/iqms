function conduct_interview_controller ($scope, $rootScope, $http, $location, $mdDialog, $routeParams,
                                       $filter, filterService, socket, toast, userService, authService) {
    var interviewId = $routeParams.id;

    var questionsByID = {};

    $scope.previousQuestions = [];
    $scope.lastQuestion = null;
    $scope.currentQuestion = {};
    $scope.queuedQuestions = [];

    $scope.state = 0;
    $scope.recommendation = 0;

    var loadInterview = function(idToken) {
        $http.get('/interview/' + interviewId + "?idToken=" + idToken).success(function (data) {
            loadInterviewTags(idToken, data.interview);
        });
    };

    var loadInterviewTags = function(idToken, interview) {
        $http.get('/interview/' + interviewId + '/tags/?idToken=' + idToken).success(function (result) {
            var tags = [],
                tagPromises = [];
            result.tags.forEach(function(tag) {
                if (tag.name != "Intro" && tag.name != "Skills" && tag.name != "Close") {
                    tags.push({
                        label: tag.name,
                        checked: true
                    });
                }
                tagPromises.push(loadTagQuestions(idToken, tag.name));
            });
            Promise.all(tagPromises).then(function() {
                loadQuestionStates(idToken);
                triggerDoneLoading(tags, interview, idToken);
            });

        });
    };

    var loadTagQuestions = function(idToken, tagName) {
        var tagPromise = $http.get('/tag/' + tagName + '/questions/?idToken=' + idToken).success(function (res) {
            var questionList = res.questions;
            questionList.forEach(function (q) {
                if (!questionsByID[q.id]) {
                    questionsByID[q.id] = q;
                    questionsByID[q.id].queued = false;
                    questionsByID[q.id].tags = {};
                    questionsByID[q.id].map = difficultyMap(q.difficulty);
                }
                questionsByID[q.id].tags[tagName] = true;
            });
        });
        return tagPromise;
    };

    var difficultyMap = function (num) {
        if (num <= 3) {
            return "Junior";
        } else if (num <= 6) {
            return "Mid";
        }
        return "Senior";
    };

    var loadQuestionStates = function(idToken) {
        $http.get('/interview/' + interviewId + '/questions?idToken=' + idToken).success(function(data) {
            data.questions.forEach(function(question) {
                $http.get('/interviewQuestion/' + interviewId + '/question/' + question.id + '?idToken=' + idToken).success(function(joined) {
                    questionsByID[question.id].blacklisted = joined.interviewQuestion.state == "Blacklisted";
                    questionsByID[question.id].highlighted = joined.interviewQuestion.state == "Pinned";
                });
            });
        });
    };

    var triggerDoneLoading = function(tags, interview, idToken) {
        filterService.setTags(tags);
        $scope.$apply();
        $rootScope.$emit('updateFilter');
        if(interview.started) {
            loadPreviousFeedbacks(idToken);
            socket.emit('request-interview', {id: interviewId, interviewerName: userService.getUserName()});
        } else {
            interview.started = true;
            $http.put('/interview/' + interviewId + "?idToken=" + idToken, interview).success(function() {});
        }
    };

    var loadPreviousFeedbacks = function(idToken) {
        $http.get('/interview/' + interviewId + '/feedback/?idToken=' + idToken).then(function(feedbacks) {
            var savedFeedbacks = feedbacks.data.feedbacks;
            resetUnansweredQuestions();
            savedFeedbacks.forEach(function(f) {
                updatePreviousQuestion(questionsByID[f.question_id], f.data, userService.getUserName());
            });
            $scope.lastQuestion = $scope.previousQuestions.pop();
            $rootScope.$emit('updateFilter');
        });
    };

    var updatePreviousQuestion = function(question, data, user) {
        question.queued = true;
        if(data[user]) {
            question.response = data[user].rating;
            question.note = data[user].note ? data[user].note : null;
        }
        $scope.previousQuestions.push(question);
    };

    var resetUnansweredQuestions = function() {
        $scope.queuedQuestions.forEach(function (q) {
            questionsByID[q.id].queued = false;
        });
        $scope.queuedQuestions = [];
        if ($scope.currentQuestion && $scope.currentQuestion.id) {
            questionsByID[$scope.currentQuestion.id].queued = false;
        }
        $scope.currentQuestion = {};
    };

    $rootScope.$on('updateFilter', function () {
        resetUnansweredQuestions();
        for (var i = 0; i < 6; i++) {
            pullQuestion();
        }
        $scope.currentQuestion = $scope.queuedQuestions.shift();
    });

    var pullQuestion = function () {
        var difficulties = filterService.getDifficulties();
        var tags = filterService.getTags();
        var qsId = $.map(questionsByID, function (value) {
            return value;
        });
        qsId = $filter('filter')(qsId, function (question) {

            if(question.blacklisted) {
                return false;
            }

            if(question.tags['Inline']) {
                return false;
            }

            if ($scope.state == 0) {
                return !question.queued && question.tags["Intro"];
            } else if ($scope.state == 1) {
                if (question.tags["Intro"] || question.tags["Close"]) {
                    return false;
                }

                if (!difficulties[0].checked && question.difficulty <= 3 ||
                    (!difficulties[1].checked && question.difficulty > 3 && question.difficulty <= 6) ||
                    (!difficulties[2].checked && question.difficulty > 6)) {
                    return false
                }

                if (excludeUnchecked(question, tags)) {
                    return false;
                }

                return !question.queued && fastIncludeFilter(question, tags);
            } else {
                return !question.queued && question.tags["Close"];
            }
        });

        if ($scope.state == 1) {
            qsId = $filter('orderTechnicalQuestions')(qsId, filterService.getOrderBy(), filterService.getTags(), false);
        }

        if (qsId.length > 0) {
            $scope.queuedQuestions.push(qsId[0]);
            questionsByID[qsId[0].id].queued = true;
        }
    };

    var excludeUnchecked = function(question, tags) {
        tags.forEach(function (tag, index) {
            if (!tag.checked && question.tags[tag.label]) {
                return true;
            }
        });
        return false;
    };

    var fastIncludeFilter = function(question, tags) {
        for (var i = 0; i < tags.length; i++) {
            if (tags[i].checked && question.tags[tags[i].label]) {
                return true;
            }
        }
        return false;
    };

    $scope.respond = function (id, value) {
        var feedback = {
            user: userService.getUserName(),
            rating: value,
            question_id: id
        };
        var reference;
        if ($scope.currentQuestion.id == id) {
            socket.emit('question-feedback', {interviewId: interviewId, user: userService.getUserName()});
            reference = $scope.currentQuestion;
        } else if ($scope.lastQuestion.id == id) {
            reference = $scope.lastQuestion;
        } else {
            for(var i = 0; $scope.previousQuestions[i].id != id; i++) {
                reference = $scope.previousQuestions[i];
            }
        }
        reference.response = value;
        feedback.note = reference.note;
        $scope.recordFeedback(feedback, $scope.currentQuestion.id == id);
    };

    $scope.recordFeedback = function (feedback, creating) {
        authService.getUserToken(function(idToken) {
            if (creating) {
                $http.post('/feedback?idToken=' + idToken, feedback).then(function (created) {
                    $http.post('/interview/' + interviewId + '/feedback/' + created.data.feedback.id + "?idToken=" + idToken).then(function (added) {});
                });
            } else {
                $http.get('/interview/' + interviewId + '/feedback/' + feedback.question_id + "?idToken=" + idToken).then(function (feedbacks) {
                    $http.put('/feedback/' + feedbacks.data.feedbacks[0].id + "?idToken=" + idToken, feedback).then(function (update) {});
                });
            }
        });
    };

    $scope.skip = function (id) {
        socket.emit('question-skip', {id: id, interviewId: interviewId, user: userService.getUserName()});
        $scope.respond(id, -1);
    };

    $scope.sendQuestionOrder = function () {
        $scope.queuedQuestions[0].test = false;
        socket.emit('question-reorder', {
            queue: $scope.queuedQuestions,
            interviewId: interviewId,
            user: userService.getUserName()
        });
    };

    $scope.changeState = function (add) {
        socket.emit('change-state', {interviewId: interviewId, state: add});
    };

    $scope.endInterview = function () {
        authService.getUserToken(function(idToken) {
            $http.get('/interview/' + interviewId + "?idToken=" + idToken).success(function (data) {
                data.interview.conducted = true;
                data.interview.user = userService.getUserName();
                data.interview.recommendation = $scope.recommendation;
                $http.put('/interview/' + interviewId + "?idToken=" + idToken, data.interview).success(function (data) {
                    $location.path('/li');
                });
            });
        });
    };

    $scope.addQuestion = function(ev) {
        $mdDialog.show({
            controller: DialogController,
            controllerAs: 'diag',
            templateUrl: 'createQuestion.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        });
    };

    $rootScope.$on('interviewQuestion', function(event, data) {
        $scope.addQuestionToQueue(data);
    });

    $scope.addQuestionToQueue = function(question) {
        if(question.id) {
            $scope.currentQuestion.queued = false;
            $scope.currentQuestion = question;
            questionsByID[question.id] = question;
            questionsByID[question.id].queued = true;
            questionsByID[question.id].tags = {};
        }
    };

    $scope.collapseQuestion = function (id) {
        $('.collapse-prev').collapse('hide');
        $('#collapse' + id).collapse('toggle');
    };

    socket.on('notify-change-state' + interviewId, function (data) {
        $scope.$apply(function () {
            $scope.state += data.state;
            $rootScope.$emit('updateFilter');
        });
    });

    socket.on('notify-question-reorder' + interviewId, function (data) {
        if (data.user == userService.getUserName() && data.queue[0].test) {
            $scope.queuedQuestions = data.queue;
        } else if (data.user == userService.getUserName()) {
            $scope.queuedQuestions[0].test = true;
            socket.emit('question-reorder', {
                queue: $scope.queuedQuestions,
                interviewId: interviewId,
                user: userService.getUserName()
            });
        } else {
            $scope.queuedQuestions = data.queue;
        }
        $scope.$apply();
    });

    socket.on('notify-update-filter' + interviewId, function (data) {
        $scope.$apply(function () {
            filterService.setTags(data.tags);
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
            pullQuestion();
        });
    });

    socket.on('notify-request-interview' + interviewId, function(data) {
        if(data.interviewerName != userService.getUserName()) {
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
            data.prev.forEach(function(num) {
                questionsByID[num].queued = true;
                $scope.previousQuestions.push(questionsByID[num]);
            });
            questionsByID[data.last].queued = true;
            $scope.lastQuestion = questionsByID[data.last];
            questionsByID[data.cur].queued = true;
            $scope.currentQuestion = questionsByID[data.cur];
            data.queued.forEach(function(num) {
                questionsByID[num].queued = true;
                $scope.queuedQuestions.push(questionsByID[num]);
            });
        }
        $scope.$apply();
    });

    filterService.setInterviewId(interviewId);
    authService.getUserToken(function(idToken) {
        loadInterview(idToken);
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