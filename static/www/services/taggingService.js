function taggingService($http) {

    var tags = [];
    var selectedTags = [];

    var isTech = true;

    $http.get('/tag').success(function (data) {
        data.tags.forEach(function(tag, index) {
            tags.push(tag);
        });
    });
    
    
    //Setters
    
    var setTech = function(tech) { 
        isTech = tech;
        if (tech) {
            addTag('Technical');
        } else {
            removeTag('Technical');
        }
    }
    
    //Getters
    
    var getTags = function() {
        return tags;
    };
    
    var getSelectedTags = function() {
        return selectedTags;
    }
    
    var getTech = function() {
        return isTech;
    }
    
    //Creation Methods
    
    var createNewTag = function(name) {
        var shouldAdd = true;
        tags.forEach(function(tag, index) {
            console.log(tag.name + " vs " + name);
           if(tag.name === name)
                shouldAdd = false; 
        });
        
        if (shouldAdd) {
            var tagData = {
                name: name,
                count: 0
            };
            
            $http.post('/tag',  tagData).success(function(created) {
                
            });
            
            tags.push({count: tagData.count, name: tagData.name});
            addTag(tagData.name);
        }
    };
    
    var addTag = function(newTag) {
        var shouldAdd = true;
        selectedTags.forEach(function(tag, index) {
            if(tag === newTag)
                shouldAdd = false;
        });
        
        if (shouldAdd) {
            selectedTags.push(newTag);
        }
    }
    
    var removeTag = function(oldTag) {
        var remove = selectedTags.indexOf(oldTag);
        if (remove > -1) {
            selectedTags.splice(remove, 1);
        }
    }
    
    var resetTags = function() {
        selectedTags = [];
        if (getTech) {
            selectedTags.push('Technical');
        }
    }
    
    return {
      setTech: setTech,
      getTags: getTags,
      getSelectedTags: getSelectedTags,
      getTech: getTech,
      createNewTag: createNewTag,
      addTag: addTag,
      removeTag: removeTag,
      resetTags: resetTags
    };
}