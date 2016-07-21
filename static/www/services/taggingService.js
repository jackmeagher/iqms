function taggingService($http, $rootScope) {

    var tags = {};
    var selectedTags = {};

    var addedTags = [];
    var removedTags = [];
    var savedTags = [];
    
    var isTech = false;
    
    var clickedTag = "";
    
    var setTech = function(tech) { 
        isTech = tech;
        return isTech;
    }
    
    var updateTech = function(tech) {
        if (tech) {
            addTag('Technical');
        } else {
            removeTag('Technical');
        }
        return setTech(tech);
    }
    
    var loadSavedTags = function(questionId) {
        
        $http.get('/question/' + questionId + '/tags/').success(function(data) {
            data.tags.forEach(function(tag, index) {
                savedTags.push(tag.name);
            })
            $rootScope.$emit('tagNotification');
        });

    }
    
    var getTags = function() {
        return tags;
    };
    
    var getSelectedTags = function() {
        
        selectedTags = {};
        
        addedTags.forEach(function(tag, index) {
            if (tags[tag]) {
                selectedTags[tag] = tags[tag]; 
            }
        });
        
        savedTags.forEach(function(tag, index) {
            if (tags[tag]) {
                selectedTags[tag] = tags[tag];
            }
        });
    
        var showTags = $.merge([], addedTags);
        showTags = $.merge(showTags, savedTags);
        
        return selectedTags;
    }
    
    //TEMP FUNCTION
    var getSelectedTagsAsArray = function() {
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
                name: name
            };
            
            $http.post('/tag',  tagData).success(function(created) {
                tags[created.tag.name].count = 0;
                selectedTags[created.tag.name] = tags[created.tag.name];
                $rootScope.$emit('tagNotification');
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
        
        $rootScope.$emit('tagNotification');
    }
    
    var removeTag = function(oldTag) {
        
        if(savedTags.indexOf(oldTag) > -1) {
            savedTags.splice(savedTags.indexOf(oldTag), 1);
            removedTags.push(oldTag);
        } else {
            addedTags.splice(addedTags.indexOf(oldTag), 1);
        }
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
            data.tags.forEach(function(tag, index) {
                countTag(tag.name);
            });
            $rootScope.$emit('tagNotification');
        });
        
    }
    
    var countTag = function(name) {
        if (tags[name]) {
            if (tags[name].count) {
                return tags[name].count;
            } else {
                $http.get('/tag/' + name + '/questions/').success(function (data) {
                    tags[name].count = data.questions.length;
                    $rootScope.$emit('tagNotification');
                });
                return 0;
            }
            
        } else {
            return 0;
        }
        
    }
    
    var updateTags = function(edit) {
        
        addedTags.forEach(function(tag, id) {
            $http.put('/tag/' + tags[tag].name,  tags[tag]).success(function(created) {
                    
            });
        });
        
        if (edit) {
            removedTags.forEach(function(tag, id) {
                $http.put('/tag/' + tags[tag].name,  tags[tag]).success(function(created) {
                        
                });
            });
        }
                
    }
    
    var deleteQuestionTags = function(deletedTags) {
        deletedTags.forEach(function(tag, index) {
            $http.put('/tag/' + tags[tag].name,  tags[tag]).success(function(created) {
                            
            });
        });
    }
    
    var persistQuestionTag = function(questionId) {
        addedTags.forEach(function(tag, index) {
            $http.post('/question/' + questionId + '/tags/' + tag).success(function(created) {

            }); 
        });
        
        
        removedTags.forEach(function(tag, index) {
            $http.delete('/question/' + questionId + '/tags/' + tag).success(function(created) {
            }); 
        });
        
    }
    
    var getClickedTag = function() {
        return clickedTag;
    }
    
    var setClickedTag = function(tag) {
        console.log(tag);
        clickedTag = tag;
    }
    
    return {
      setTech: setTech,
      updateTech: updateTech,
      loadSavedTags: loadSavedTags,
      getTags: getTags,
      getSelectedTags: getSelectedTags,
      getSelectedTagsAsArray: getSelectedTagsAsArray,
      getTech: getTech,
      createNewTag: createNewTag,
      addTag: addTag,
      removeTag: removeTag,
      resetTags: resetTags,
      countTag: countTag,
      updateTags: updateTags,
      deleteQuestionTags: deleteQuestionTags,
      persistQuestionTag: persistQuestionTag,
      getClickedTag: getClickedTag,
      setClickedTag: setClickedTag
    };
}