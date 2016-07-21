function flaggingService($http) {
    
    var questionList = [];
    
    var addQuestions = function(additionalQuestions) {
        for(var i = 0; i < additionalQuestions.length; i++) {
            var found = false;
            for(var id = 0; id < questionList.length; id++) {
                if (additionalQuestions[i].id === questionList[id].id) {
                    found = true;
                    questionList[id].state = additionalQuestions[i].state;
                    id = questionList.length;
                }
            }
            if (!found) {
                questionList.push(additionalQuestions[i]);
            }
        }
        
        console.log(questionList);
    }
    
    var persistQuestions = function(interviewID) {
        for(var i = 0; i < questionList.length; i++) {
            if (questionList[i].state == "Pinned") {
                $http.post('/question/' + questionList[i].id +
                           '/interview/' + interviewID, questionList[i]).success(function(created) {
                    
                });
            } else if (questionList[i].state == "Blacklisted") {
                $http.post('/question/' + questionList[i].id +
                           '/interview/' + interviewID, questionList[i]).success(function(created) {
                    
                });
            }
        }
    }
    
    return {    
        addQuestions: addQuestions,
        persistQuestions: persistQuestions
    };
}