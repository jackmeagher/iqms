function flaggingService($http, $rootScope) {
    
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
                console.log(questionList);
                questionList[selectedTag].push(additionalQuestions[i]);
                questionListById[additionalQuestions[i].id] = additionalQuestions[i];
                console.log(additionalQuestions[i]);
            }
        }
        
        console.log(questionList);
    }
    
    var pullQuestions = function() {
        return questionList;
    }
    
    var persistQuestions = function(interviewID) {
        for (var key in questionListById) {
            if (questionListById.hasOwnProperty(key)) {
                if (questionListById[key].state == "Pinned" || questionListById[key].state == "Blacklisted") {
                    $http.post('/question/' + key +
                           '/interview/' + interviewID, questionListById[key]).success(function(created) {
                        
                    });
                }
                console.log(key + " -> " + questionListById[key]);
            }
          }
       /* for(var i = 0; i < questionList.length; i++) {
            if (questionList[i].state == "Pinned") {
                $http.post('/question/' + questionList[i].id +
                           '/interview/' + interviewID, questionList[i]).success(function(created) {
                    
                });
            } else if (questionList[i].state == "Blacklisted") {
                $http.post('/question/' + questionList[i].id +
                           '/interview/' + interviewID, questionList[i]).success(function(created) {
                    
                });
            }
        }*/
    }
    
    var clearQuestions = function() {
        questionList = {};
        questionListById = {};
        if (!questionList[selectedTag]) {
            questionList[selectedTag] = [];
            console.log(questionList);
        }
    }
    
    var loadQuestionList = function(id) {
        //Might have to save tag in this database as well...?
        $http.get('/interview/' + id + '/questions/').success(function(data) {
           //console.log(data.questions);
           data.questions.forEach(function(question, index) {
            questionListById[question.id] = question;
            $http.get('/interviewQuestion/' + question.id + '/interview/' + id).success(function(result) {
               questionListById[question.id].state = result.result.state;
               console.log(questionListById);
               $rootScope.$emit('flagNotification');
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