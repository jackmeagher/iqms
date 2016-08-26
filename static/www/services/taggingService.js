function taggingService($http, $rootScope, authService) {

    var tags = {};
    var selectedTags = {};

    var addedTags = [];
    var removedTags = [];
    var savedTags = [];
    
    var clickedTag = "";

    var category = 'skills';

    var setCategory = function(tag) {
        removeTag('intro');
        removeTag('skills');
        removeTag('close');
        addTag(tag);
        category = tag;
    };

    var getCategory = function() {
        return category;
    }

    var loadSavedTags = function(questionId, idToken) {
        $http.get('../question/' + questionId + '/tags/?idToken=' + idToken).success(function(data) {
            data.tags.forEach(function(tag, index) {
                savedTags.push(tag.name);
                if(tag.name == "intro" || tag.name == "skills" || tag.name == "close") {
                    category = tag.name;
                }
            });
            $rootScope.$emit('tagNotification');
        });

    };
    
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

        name = name.toLowerCase();

        var shouldAdd = true;
        if (tags[name]) {
            shouldAdd = false;
        }
        
        if (shouldAdd) {
            var tagData = {
                name: name
            };

            authService.getUserToken(function(idToken) {
                $http.post('../tag?idToken=' + idToken,  tagData).success(function(created) {
                    if(!tags)
                        tags = {};
                    tags[created.tag.name].count = 0;
                    selectedTags[created.tag.name] = tags[created.tag.name];
                    $rootScope.$emit('tagNotification');
                });
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

        authService.getUserToken(function(idToken) {
            $http.get('../tag?idToken=' + idToken).success(function (data) {
                data.tags.forEach(function(tag, index) {
                    tags[tag.name] = tag;
                });
                data.tags.forEach(function(tag, index) {
                    countTag(tag.name);
                });
                $rootScope.$emit('tagNotification');
            });
        });
    };
    
    var countTag = function(name) {
        if (tags[name]) {
            if (tags[name].count) {
                return tags[name].count;
            } else {
                authService.getUserToken(function(idToken) {
                    $http.get('../tag/' + name + '/questions/?idToken=' + idToken).success(function (data) {
                        tags[name].count = data.questions.length;
                        $rootScope.$emit('tagNotification');
                    });
                });
                return 0;
            }
            
        } else {
            return 0;
        }
        
    }
    
    var deleteQuestionTags = function(deletedTags) {
        authService.getUserToken(function(idToken) {
            deletedTags.forEach(function(tag, index) {
                $http.put('../tag/' + tags[tag].name + "?idToken=" + idToken,  tags[tag]).success(function(created) {

                });
            });
        });
    }
    
    var persistQuestionTag = function(questionId) {
        authService.getUserToken(function(idToken) {
            addedTags.forEach(function(tag, index) {
                $http.post('../question/' + questionId + '/tags/' + tag + "?idToken=" + idToken).success(function(created) {

                });
            });
            removedTags.forEach(function(tag, index) {
                $http.delete('../question/' + questionId + '/tags/' + tag + "?idToken=" + idToken).success(function(created) {
                });
            });
        });
    }
    
    var getClickedTag = function() {
        return clickedTag;
    }
    
    var setClickedTag = function(tag) {
        clickedTag = tag;
    }
    
    return {
        setCategory: setCategory,
        getCategory: getCategory,
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
        deleteQuestionTags: deleteQuestionTags,
        persistQuestionTag: persistQuestionTag,
        getClickedTag: getClickedTag,
        setClickedTag: setClickedTag
    };
}