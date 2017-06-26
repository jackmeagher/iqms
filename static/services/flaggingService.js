function flaggingService($http, $rootScope, authService) {
    
    var questionList = {};
    var questionListById = {};
    var selectedTag = "";
    
    var addQuestions = function(additionalQuestions) {
        for(var i = 0; i < additionalQuestions.length; i++) {
            var found = false;
            for(var id = 0; id < questionList.length; id++) {
                if (additionalQuestions[i].id === questionList[selectedTag][id].id) {
                    found = true;
                    questionList[selectedTag][id].state = additionalQuestions[i].state;
                    questionListById[additionalQuestions[i].id] = additionalQuestions[i];
                    id = questionList[selectedTag].length;
                }
            }
            if (!found) {
                questionList[selectedTag].push(additionalQuestions[i]);
                questionListById[additionalQuestions[i].id] = additionalQuestions[i];
            }
        }
    }
    
    var pullQuestions = function() {
        return questionList;
    }
    
    var persistQuestions = function(interviewID) {
        authService.getUserToken(function(idToken) {
            for (var key in questionListById) {
                if (questionListById.hasOwnProperty(key)) {
                    if (questionListById[key].state == "Pinned" || questionListById[key].state == "Blacklisted") {
                        $http.post('../../question/' + key +
                            '/interview/' + interviewID + "?idToken=" + idToken, questionListById[key]).success(function(created) {
                        });
                    }
                }
            }
        });
    }
    
    var clearQuestions = function() {
        questionList = {};
        questionListById = {};
        if (!questionList[selectedTag]) {
            questionList[selectedTag] = [];
        }
    }
    
    var loadQuestionList = function(id) {
        authService.getUserToken(function(idToken) {
            $http.get('../../interview/' + id + '/questions/?idToken=' + idToken).success(function(data) {
                data.questions.forEach(function(question, index) {
                    questionListById[question.id] = question;
                    $http.get('../../interviewQuestion/' + question.id + '/interview/' + id + "?idToken=" + idToken).success(function(result) {
                        questionListById[question.id].state = result.result.state;
                        $rootScope.$emit('flagNotification');
                    });
                });
            });
        });
    }
    
    var getQuestions = function() {
        return questionListById;
    }
    
    var setSelectedTag = function(tag) {
        selectedTag = tag;
        if (!questionList[selectedTag]) {
            questionList[selectedTag] = [];
        }
    }
    
    return {    
        addQuestions: addQuestions,
        clearQuestions: clearQuestions,
        getQuestions: getQuestions,
        loadQuestionList: loadQuestionList,
        persistQuestions: persistQuestions,
        setSelectedTag: setSelectedTag
    };
}