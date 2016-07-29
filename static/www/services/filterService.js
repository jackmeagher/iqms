function filterService($rootScope) {
    var difficulties = [];
    var tags = [];
    
    var interviewId = 0;
    
    var orderBy = ['tags', 'difficulty'];
    
    var setOrderBy = function(order) {
        orderBy = order;
        $rootScope.$emit('updateFilter');
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
        $rootScope.$emit('updateFilter');
    }
    
    var getTags = function() {
        return tags;
    }
    
    var setDifficulties = function(difficultyArray) {
        difficulties = difficultyArray;
        $rootScope.$emit('updateFilter');
    }
    
    var getDifficulties = function() {
        return difficulties;
    }
    
    var setTagByIndex = function(index) {
        tags[index].checked = !tags[index].checked;
        $rootScope.$emit('updateFilter');
    }
    
    var setDifficultyByIndex = function(index) {
        if (difficulties[index].checked) {
            difficulties[index].checked = false;
        } else {
            difficulties[index].checked = true;
        }
        
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
        setTagByIndex: setTagByIndex,
        setDifficultyByIndex: setDifficultyByIndex
    }
}