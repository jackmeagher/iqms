function filterService($rootScope) {
    var difficulties = [{
        label: "Junior",
        checked: true
    }, {
        label: "Mid",
        checked: true
    }, {
        label: "Senior",
        checked: true
    }];
    var tags = [];
    
    var interviewId = 0;
    
    var orderBy = ['tags', 'difficulty'];
    
    var setOrderBy = function(order) {
        orderBy = order;
        emitRequest();
    }
    
    var getOrderBy = function() {
        return orderBy;
    }
    
    var setInterviewId = function(id) {
        interviewId = id;
    }
    
    var getInterviewId = function() {
        return interviewId;
    }
    
    var setTags = function(tagArray) {
        tags = tagArray;
        emitRequest();
    }
    
    var getTags = function() {
        return tags;
    }
    
    var setDifficulties = function(difficultyArray) {
        difficulties = difficultyArray;
        emitRequest();
    }
    
    var getDifficulties = function() {
        return difficulties;
    }
    
    var setTagByIndex = function(index) {
        tags[index].checked = !tags[index].checked;
        emitRequest();
    }
    
    var emitRequest = function() {
        $rootScope.$emit('updateFilter');
    }
    
    return {
        setOrderBy: setOrderBy,
        getOrderBy: getOrderBy,
        setInterviewId: setInterviewId,
        getInterviewId: getInterviewId,
        setTags: setTags,
        getTags: getTags,
        setDifficulties: setDifficulties,
        getDifficulties: getDifficulties,
        setTagByIndex: setTagByIndex
    }
}