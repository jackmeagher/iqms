function taggingService($http) {

    var types = [];
    var currentTags = [];
    
    var selectedType = null;
    
    $http.get('/type').success(function(data) {
        data.types.forEach(function(type, index) {
           types.push({name: type.label, id: types.length, tags: []}); 
        });
        
        $http.get('/tag').success(function (data) {
            data.tags.forEach(function(tag, index) {
                types.forEach(function(type, index) {
                   if(type.name === tag.type) {
                        type.tags.push(tag);
                   }
                });
            });
        });
    });
    
    //Setters
    
    var updateSelectedType = function(value) {
        $("#topic-box").css({"visibility": "visible"});
        selectedType = value;
        currentTags = types[selectedType.id].tags;
    };
    
     var updateSelectedTypeByName = function(name) {
        types.forEach(function(type, index) {
           if(type.name == name) {
            selectedType = type;
           }
        });
        
        currentTags = types[selectedType.id].tags;
    }
    
    //Getters

    var getTypes = function() {
        return types;
    };
    
    var getSelectedType = function() {
        return selectedType;
    }
    
    var getCurrentTags = function() {
        return currentTags;
    };
    
    
    //Creation Methods
    
    var createNewTag = function(name) {
        var shouldAdd = true;
        types[selectedType.id].tags.forEach(function(tag, index) {
           if(topic.name === name)
                shouldAdd = false; 
        });
        
        if (shouldAdd) {
            var tagData = {
                type: types[selectedType.id].name,
                name: name
            };
            
            $http.post('/tag',  tagData).success(function(created) {
                
            });
            
            types[selectedType.id].tags.push({type: tagData,type, name: tagData.name});
            updateSelectedType(selectedType);
        }
    };
    
    return {
      updateSelectedType: updateSelectedType,
      updateSelectedTypeByName: updateSelectedTypeByName,
      getTypes: getTypes,
      getSelectedType: getSelectedType,
      getCurrentTags: getCurrentTags,
      createNewTag: createNewTag
    };
}