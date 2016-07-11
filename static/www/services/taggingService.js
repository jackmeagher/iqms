function taggingService($http) {

    var tags = [];
    var selectedTags = [];

    var isTech = true;

    
    
    
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
        
        tags = [];
        
        $http.get('/tag').success(function (data) {
            data.tags.forEach(function(tag, index) {
                tags.push(tag);
            });
            createNewTag('Technical');
        });
        
        selectedTags = [];
        if (getTech) {
            selectedTags.push('Technical');
        }
    }
    
    var countTag = function(name) {
        
        var count = 0;
        
        tags.forEach(function(tag, index) {
            if (tag.name === name) {
                count = tag.count;
            }
        });
        return count;
    }
    
    var updateTags = function(val) {
        selectedTags.forEach(function(sTag, index) {
            tags.forEach(function(tag, id) {
                if (sTag === tag.name) {
                    if (val) {
                        tag.count++;
                    } else {
                        tag.count--;
                    }
                    $http.put('/tag/' + (id + 1),  tag).success(function(created) {
                
                    });
                }
            });
        });
    }
    
    return {
      setTech: setTech,
      getTags: getTags,
      getSelectedTags: getSelectedTags,
      getTech: getTech,
      createNewTag: createNewTag,
      addTag: addTag,
      removeTag: removeTag,
      resetTags: resetTags,
      countTag: countTag,
      updateTags: updateTags
    };
}