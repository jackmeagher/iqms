function filterService($rootScope) {
    var difficulties = [];
    var tags = [];
    
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
        setTags: setTags,
        getTags: getTags,
        setDifficulties: setDifficulties,
        getDifficulties: getDifficulties,
        setTagByIndex: setTagByIndex,
        setDifficultyByIndex: setDifficultyByIndex
    }
}