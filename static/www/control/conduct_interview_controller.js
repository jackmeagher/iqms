/**
 * Created by nick on 4/12/16.
 */


function conduct_interview_controller ($scope,$rootScope,$http,$window,$routeParams,$filter, $interval, socket, filterService, toast) {
    var interviewId = $routeParams.id;
    filterService.setInterviewId(interviewId);
    $scope.interview = {};
    $scope.questionList = {};
    $scope.questionsByID = {};
    $scope.currentTag = "";
    
    $scope.previousQuestions = [];
    $scope.lastQuestion = null;
    $scope.currentQuestion = {};
    $scope.queuedQuestions = [];
    
    $scope.interviewerName = "User";
    
    $scope.state = 0;
    
    $scope.difficulties = [{
        label: "Junior",
        checked: true
    }, {
        label: "Mid",
        checked: true
    }, {
        label: "Senior",
        checked: true
    }];
    
    filterService.setDifficulties($scope.difficulties);
    
    $scope.tags = [];
    
    $scope.collapseQuestion = function(id) {
        console.log(id);
        $('.collapse-prev').collapse('hide');
        $('#collapse' + id).collapse('toggle');
    }
    
    $http.get('/interview/' + interviewId).success(function (data) {
        $scope.interview = data.interview;    
        $http.get('/interview/' + interviewId +'/tags/').success(function(result) {
            result.tags.forEach(function(tag, index) {
                if (tag.name != "Intro" && tag.name != "Technical" && tag.name != "Close") {
                    $scope.tags.push({
                        label: tag.name,
                        checked: true
                     });
                     filterService.setTags($scope.tags);
                }
                $scope.questionList[tag.name] = [];
                $http.get('/tag/' + tag.name + '/questions/').success(function(res) {
                    $scope.questionList[tag.name] = res.questions;
                    console.log(res.questions);
                    $scope.currentTag = "Technical";
                    $scope.questionList[tag.name].forEach(function(q, index) {
                        if (!$scope.questionsByID[q.id]) {
                            $scope.questionsByID[q.id] = q;
                            $scope.questionsByID[q.id].queued = false;
                            $scope.questionsByID[q.id].tags = {};
                            $scope.questionsByID[q.id].tags[tag.name] = true;
                        }
                    
                    });
                   
                    if (index + 1 === result.tags.length) {
                        for(var i = 0; i < 6; i++)
                            $scope.pullQuestion();
                       
                        $scope.currentQuestion = $scope.queuedQuestions.shift();
                    }
                });
            });
        });
    });

    $scope.respond = function(id, value) {
        if ($scope.currentQuestion.id == id) {
            socket.emit('question-feedback', {interviewId: interviewId, user: $scope.interviewerName});
            $scope.currentQuestion.response = value;
            var feedback = {
                user: $scope.interviewerName,
                rating: value,
                note: $scope.currentQuestion.note,
                question_id: id
            };
            $http.post('/feedback', feedback).then(function(created) {
                $http.post('/interview/' + interviewId + '/feedback/' + created.data.feedback.id).then(function(added) {
                });
            });
        } else if($scope.lastQuestion.id == id) {
            $scope.lastQuestion.response = value;
            var feedback = {
                user: $scope.interviewerName,
                rating: value,
                note: $scope.lastQuestion.note,
                question_id: id
            };
            $http.get('/interview/' + interviewId + '/feedback/' + id).then(function(feedbacks) {
               $http.put('/feedback/' + feedbacks.data.feedbacks[0].id, feedback).then(function(update) {
               });
            });
        } else {
            var index;
            for(var i = 0; i < $scope.previousQuestions.length; i++) {
                if ($scope.previousQuestions[i].id == id) {
                    $scope.previousQuestions[i].response = value;
                    index = i;
                    i = $scope.previousQuestions.length;
                }
            }
            
            var feedback = {
                user: $scope.interviewerName,
                rating: value,
                note: $scope.previousQuestions[index].note,
                question_id: id
            };
            $http.get('/interview/' + interviewId + '/feedback/' + id).then(function(feedbacks) {
               $http.put('/feedback/' + feedbacks.data.feedbacks[0].id, feedback).then(function(update) {
               });
            });
        }
    }
    
    $scope.saveNote = function(id) {
        if ($scope.currentQuestion.id == id) {
            socket.emit('question-feedback', {interviewId: interviewId, user: $scope.interviewerName});
            var feedback = {
                user: $scope.interviewerName,
                note: $scope.currentQuestion.note,
                question_id: id
            };
            $http.post('/feedback', feedback).then(function(created) {
                $http.post('/interview/' + interviewId + '/feedback/' + created.data.feedback.id).then(function(added) {
                });
            });
        } else if($scope.lastQuestion.id == id) {
            var feedback = {
                user: $scope.interviewerName,
                note: $scope.lastQuestion.note,
                question_id: id
            };
            $http.get('/interview/' + interviewId + '/feedback/' + id).then(function(feedbacks) {
               $http.put('/feedback/' + feedbacks.data.feedbacks[0].id, feedback).then(function(update) {
               });
            });
        } else {
            var index;
            for(var i = 0; i < $scope.previousQuestions.length; i++) {
                if ($scope.previousQuestions[i].id == id) {
                    index = i;
                    i = $scope.previousQuestions.length;
                }
            }
            
            var feedback = {
                user: $scope.interviewerName,
                note: $scope.previousQuestions[index].note,
                question_id: id
            };
            $http.get('/interview/' + interviewId + '/feedback/' + id).then(function(feedbacks) {
               $http.put('/feedback/' + feedbacks.data.feedbacks[0].id, feedback).then(function(update) {
               });
            });
        }
    }
    
    $scope.skip = function(id) {
        socket.emit('question-skip', {id: id, interviewId: interviewId, user: $scope.interviewerName});
        if ($scope.currentQuestion.id == id) {
            socket.emit('question-feedback', {interviewId: interviewId, user: $scope.interviewerName});
            $scope.currentQuestion.response = -1;
            var feedback = {
                user: $scope.interviewerName,
                rating: -1,
                note: $scope.currentQuestion.note,
                question_id: id
            };
            $http.post('/feedback', feedback).then(function(created) {
                $http.post('/interview/' + interviewId + '/feedback/' + created.data.feedback.id).then(function(added) {
                });
            });
        } else if($scope.lastQuestion.id == id) {
            $scope.lastQuestion.response = -1;
             var feedback = {
                user: $scope.interviewerName,
                rating: -1,
                note: $scope.lastQuestion.note,
                question_id: id
            };
            $http.get('/interview/' + interviewId + '/feedback/' + id).then(function(feedbacks) {
               $http.put('/feedback/' + feedbacks.data.feedbacks[0].id, feedback).then(function(update) {
               });
            });
        } else {
            var index;
            for(var i = 0; i < $scope.previousQuestions.length; i++) {
                if ($scope.previousQuestions[i].id == id) {
                    $scope.previousQuestions[i].response = -1;
                    i = $scope.previousQuestions.length;
                }
            }
            var feedback = {
                user: $scope.interviewerName,
                rating: -1,
                note: $scope.previousQuestions[index].note,
                question_id: id
            };
            $http.get('/interview/' + interviewId + '/feedback/' + id).then(function(feedbacks) {
               $http.put('/feedback/' + feedbacks.data.feedbacks[0].id, feedback).then(function(update) {
               });
            });
        }
    }
    
    $scope.pullQuestion = function() {
        $scope.difficulties = filterService.getDifficulties();
        $scope.tags = filterService.getTags();
        var qsId = $.map($scope.questionsByID, function(value, index) {
            return value;
        });
        
        qsId = $filter('filter')(qsId, function(question){
            if ($scope.state == 0) {
                return !question.queued && question.tags["Intro"];
            } else if ($scope.state == 1) {
                if (question.tags["Intro"] || question.tags["Close"]) {
                    return false;
                }
                
                if (!$scope.difficulties[0].checked && question.difficulty <= 3) {
                    return false
                } else if (!$scope.difficulties[1].checked && question.difficulty > 3 && question.difficulty <= 6) {
                    return false;
                } else if (!$scope.difficulties[2].checked && question.difficulty > 6) {
                    return false
                }
            
                var del = false;
                
                $scope.tags.forEach(function(tag, index) {
                    if(!tag.checked && question.tags[tag.label]) {
                        del = true;
                    }
                });
                
                if (del) {
                    return false;
                }
                
                del = false;
                
                for(var i = 0; i < $scope.tags.length; i++) {
                    if($scope.tags[i].checked && question.tags[$scope.tags[i].label]) {
                        del = true;
                        i = $scope.tags.length;
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
    
    socket.on('notify-question-feedback' + interviewId, function(data) {
        $scope.$apply(function() {
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
    
    socket.on('notify-question-skip' + interviewId, function(data) {
        $scope.$apply(function() {
            toast.info(data.message);
            if ($scope.currentQuestion.id == data.id) {
                $scope.currentQuestion.skipped = true;
            } else if($scope.lastQuestion.id == data.id) {
                $scope.lastQuestion.skipped = true;
            } else {
                var index;
                for(var i = 0; i < $scope.previousQuestions.length; i++) {
                    if ($scope.previousQuestions[i].id == data.id) {
                        $scope.previousQuestions[i].skipped = true;
                        i = $scope.previousQuestions.length;
                    }
                }
            }
        });
    });
    
    $scope.sendQuestionOrder = function() {
        socket.emit('question-reorder', {queue: $scope.queuedQuestions, interviewId: interviewId, user: $scope.interviewerName});
    }
    
    socket.on('notify-question-reorder' + interviewId, function(data) {
       $scope.$apply(function() {
        $scope.queuedQuestions = data.queue;
       });
    });
    
    $scope.difficultyMap = function(num) {
        if (num <= 3) {
            return "Junior";
        } else if (num <= 6) {
            return "Mid";
        }
        return "Senior";
    }
    
    socket.on('notify-update-filter' + interviewId, function(data) {
       $scope.$apply(function() {
            filterService.setTags(data.tags);
            filterService.setDifficulties(data.difficulties);
            filterService.setOrderBy(data.order);
            toast.info(data.message);
       });
    });
    
    $rootScope.$on('updateFilter', function(data) {
        $scope.queuedQuestions.forEach(function(q, index) {
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
    
    $scope.changeState = function(add) {
        
        if (add) {
            $scope.state++;
        } else {
            $scope.state--;
        }
        
        socket.emit('change-state', {interviewId: interviewId, state: $scope.state});
    }
    
    $scope.endInterview = function() {
        window.location.href = '#/';
        $http.get('/interview/' + interviewId).success(function (data) {
            $scope.interview = data.interview;
            $scope.interview.conducted = true;
            $http.put('/interview/' + interviewId, $scope.interview).success(function(data) {
                
            });
        });
    }
    
    socket.on('notify-change-state' + interviewId, function(data) {
         $scope.$apply(function() {
            $rootScope.$emit('updateFilter');
            $scope.state = data.state;
         });
    });
}