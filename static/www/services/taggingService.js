function taggingService($http) {

    var tags = [];
    var selectedTags = [];

    var isTech = true;

    var addedTags = [];
    var removedTags = [];
    
    
    //Setters
    
    var setTech = function(tech) { 
        isTech = tech;
        if (tech) {
            addTag('Technical');
        } else {
            removeTag('Technical');
        }
    }
    
    var setSelected = function(sel) {
        selectedTags = sel;
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
                console.log();
                
            });
            
            tags.push(tagData);
            addTag(tagData.name);
            
            $http.get('/tag').success(function (data) {
                tags = data.tags;
            });
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
        
        var remove = removedTags.indexOf(newTag);
        
        if (remove > -1) {
            removedTags.splice(remove, 1);
        }
    }
    
    var removeTag = function(oldTag) {
        var remove = selectedTags.indexOf(oldTag);
        
        if (remove > -1) {
            selectedTags.splice(remove, 1);
        }
        
        removedTags.push(oldTag);
    }
    
    var resetTags = function() {
        
        tags = [];
        
        $http.get('/tag').success(function (data) {
            tags = data.tags;
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
        console.log(val);
        console.log(tags);
        switch (val) {
            case("ADD"):
                tags.forEach(function(tag, id) {
                    selectedTags.forEach(function(sTag, index) {   
                        if (sTag === tag.name) {
                            tag.count++;
                            console.log("Updating " + tag.name + " with a value of " + tag.count + " (" + id +")");
                            
                            $http.put('/tag/' + tag.id,  tag).success(function(created) {
                            
                            });
                        }
                    });
                });
                break;
            case("EDIT"):
                tags.forEach(function(tag, id) {
                    selectedTags.forEach(function(sTag, index) {
                        if (sTag === tag.name) {
                            tag.count++;
                            
                            console.log("Updating " + tag.name + " with a value of " + tag.count + " (" + id +")");
                            
                            $http.put('/tag/' + (id + 1),  tag).success(function(created) {
                                
                            });
                        }
                    });
                    removedTags.forEach(function(sTag, index) {
                        if (sTag === tag.name) {
                            tag.count--;
                            
                            console.log("Updating " + tag.name + " with a value of " + tag.count + " (" + id +")");
                            
                            $http.put('/tag/' + (id + 1),  tag).success(function(created) {
                            
                            });
                        }
                    });
                });
                removedTags = [];
                break;
            case("DELETE"):
                tags.forEach(function(tag, id) {
                    selectedTags.forEach(function(sTag, index) {
                        if (sTag === tag.name) {
                            tag.count--;
                            
                            console.log("Updating " + tag.name + " with a value of " + tag.count);
                            
                            $http.put('/tag/' + (id + 1),  tag).success(function(created) {
                                
                            });
                        }
                    });
                });
                removedTags = [];
                break;
        }
        
        
    }
    
    return {
      setTech: setTech,
      setSelected: setSelected,
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