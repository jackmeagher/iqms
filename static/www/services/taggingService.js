function taggingService($http) {

    var currentTopics = [];
    var currentSubTopics = [];
    
    var selectedType = null;
    var selectedTopic = null;
    
    var types = [];
    
    var updateSelectedType = function(value) {
        $("#topic-box").css({"visibility": "visible"});
        selectedType = value;
        currentTopics = types[selectedType.id].topics;
        currentSubTopics = [];
    };
    
    var updateSelectedTypeByName = function(name) {
        types.forEach(function(type, index) {
           if(type.name == name) {
            selectedType = type;
           }
        });
        return types[selectedType.id];
    }
    
    var updateSelectedTopic = function(topic) {
        selectedTopic = topic;
        currentSubTopics = topic.sub;
    };
    
    var updateSelectedTopicByName = function(name) {
        var i = 0;
        types[selectedType.id].topics.forEach(function(topic, index) {
           if(topic.name == name) {
                selectedTopic = topic;
                currentSubTopics = topic.sub;
                console.log(topic.sub);
                i = index;
           }
        });
        selectedTopic = types[selectedType.id].topics[i];
        currentSubTopics = selectedTopic.sub;
        console.log(selectedTopic);
    }

    var getTypes = function() {
        return types;
    };
    
    var getCurrentTopics = function() {
        return currentTopics;
    };
    
    var getCurrentSubTopics = function() {
        return currentSubTopics;
    };
    
    var createNewTopic = function(name) {
        
        var shouldAdd = true;
        types[selectedType.id].topics.forEach(function(topic, index) {
           if(topic.name === name)
                shouldAdd = false; 
        });
        
        if (shouldAdd) {
            var topicData = {
                type: types[selectedType.id].name,
                name: name,
                index: types[selectedType.id].topics.length,
                sub: ["dsfsd", "sdfds"]
            };
            
            $http.post('/topic',  topicData).success(function(created){});
            
            types[selectedType.id].topics.push({name: topicData.name, index: topicData.index, sub: []});
            updateSelectedType(selectedType);
            updateSelectedTopic(types[selectedType.id].topics[types[selectedType.id].topics.length - 1]);
        }
        
    };
    
    $http.get('/type').success(function(data) {
        data.types.forEach(function(type, index) {
           types.push({name: type.label, id: types.length, topics: []}); 
        });
        
        $http.get('/topic').success(function (data) {
            data.topics.forEach(function(top, index) {
                types.forEach(function(typ, index) {
                   if(typ.name === top.type) {
                        typ.topics.push(top);
                   }
                });
            });
        });
    });
    
    var createNewSubTopic = function(name) {
    
        
        if (name) {
            console.log(selectedTopic);
            if (!selectedTopic.sub) {
                selectedTopic.sub = [];
            }
            selectedTopic.sub.push(name);
            currentSubTopics = selectedTopic.sub;
            
            var topicData = {
                sub: currentSubTopics
            };
            
            console.log(selectedTopic.id);
            
          $http.put('/topic/' + selectedTopic.id, topicData).success(function(created){
                console.log(created);    
            });
        }
        
    }
    
    var getSelectedType = function() {
        return selectedType;
    }
    
    var getSelectedTopic = function() {
        return selectedTopic;
    }
    
    return {
      updateSelectedType: updateSelectedType,
      updateSelectedTypeByName: updateSelectedTypeByName,
      updateSelectedTopic: updateSelectedTopic,
      updateSelectedTopicByName: updateSelectedTopicByName,
      getTypes: getTypes,
      getCurrentTopics: getCurrentTopics,
      getCurrentSubTopics: getCurrentSubTopics,
      createNewTopic: createNewTopic,
      createNewSubTopic: createNewSubTopic,
      getSelectedType: getSelectedType,
      getSelectedTopic: getSelectedTopic
    };
}