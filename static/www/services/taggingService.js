function taggingService($http) {

    var tags = {};
    var selectedTags = {};

    var isTech = true;

    var addedTags = [];
    var removedTags = [];
    var savedTags = [];
    
    
    //Setters
    
    var setTech = function(tech) { 
        isTech = tech;
    }
    
    var loadSavedTags = function(saved) {
        savedTags = saved;
    }
    
    //Getters
    
    var getTags = function() {
        return tags;
    };
    
    var getSelectedTags = function() {
        
        selectedTags = {};
        
        addedTags.forEach(function(tag, index) {
           selectedTags[tag] = tags[tag]; 
        });
        
        savedTags.forEach(function(tag, index) {
           selectedTags[tag] = tags[tag]; 
        });
    
        var showTags = $.merge([], addedTags);
        showTags = $.merge(showTags, savedTags);
        return showTags;
    }
    
    var getTech = function() {
        return isTech;
    }
    
    //Creation Methods
    
    var createNewTag = function(name) {
        var shouldAdd = true;
        if (tags[name]) {
            shouldAdd = false;
        }
        
        if (shouldAdd) {
            var tagData = {
                name: name,
                count: 0
            };
            
            $http.post('/tag',  tagData).success(function(created) {
                tags[created.tag.name].count = created.tag.count;
                tags[created.tag.name].id = created.tag.id;
                selectedTags[created.tag.name] = tags[created.tag.name];
            });
            
            tags[tagData.name] = tagData;
           
            addTag(tagData.name);
        }
    };
    
    var addTag = function(newTag) {
        var shouldAdd = true;
        
        getSelectedTags();
        
        if (selectedTags[newTag]) {
            shouldAdd = false;
        }
        
        if (shouldAdd) {
            if (removedTags.indexOf(newTag) > -1) {
                removedTags.splice(removedTags.indexOf(newTag), 1);
                savedTags.push(newTag);
            } else {
                addedTags.push(newTag);
            }
        }
        
        getSelectedTags();
      //  console.log(getSelectedTags());
    }
    
    var removeTag = function(oldTag) {
        
        getSelectedTags();
        
        if(savedTags.indexOf(oldTag) > -1) {
            savedTags.splice(savedTags.indexOf(oldTag), 1);
            removedTags.push(oldTag);
        } else {
            addedTags.splice(addedTags.indexOf(oldTag), 1);
        }
        
        getSelectedTags();
    }
    
    var resetTags = function() {
        
        tags = {};
        selectedTags = {};
        
        addedTags = [];
        removedTags = [];
        savedTags = [];
        
        $http.get('/tag').success(function (data) {
            data.tags.forEach(function(tag, index) {
               tags[tag.name] = tag; 
            });
            
            getSelectedTags();
        });
        
    }
    
    var countTag = function(name) {
        if (!tags[name]) {
            return 0;
        }
        if (!tags[name].count) {
            tags[name].count = 0;
        }
        return tags[name].count;
    }
    
    var updateTags = function(val) {
        switch (val) {
            case("ADD"):
                addedTags.forEach(function(tag, id) {
                    tags[tag].count++;
                    $http.put('/tag/' + tags[tag].id,  tags[tag]).success(function(created) {
                            
                    });
                });
                break;
            case("EDIT"):
                console.log(addedTags);
                addedTags.forEach(function(tag, id) {
                    tags[tag].count++;
                    $http.put('/tag/' + tags[tag].id,  tags[tag]).success(function(created) {
                            
                    });
                });
                console.log(removedTags);
                removedTags.forEach(function(tag, id) {
                    tags[tag].count--;
                    $http.put('/tag/' + tags[tag].id,  tags[tag]).success(function(created) {
                            
                    });
                });
                break;
        }
    }
    
    var deleteQuestionTags = function(deletedTags) {
        deletedTags.forEach(function(tag, index) {
            tags[tag].count--; 
            $http.put('/tag/' + tags[tag].id,  tags[tag]).success(function(created) {
                            
            });
        });
    }
    
    return {
      setTech: setTech,
      loadSavedTags: loadSavedTags,
      getTags: getTags,
      getSelectedTags: getSelectedTags,
      getTech: getTech,
      createNewTag: createNewTag,
      addTag: addTag,
      removeTag: removeTag,
      resetTags: resetTags,
      countTag: countTag,
      updateTags: updateTags,
      deleteQuestionTags: deleteQuestionTags
    };
}