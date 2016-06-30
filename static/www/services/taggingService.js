function taggingService($http) {

    var currentTopics = [];
    var currentSubTopics = [];
    
    var selectedType = 0;
    var selectedTopic = null;
    
    var types = [];
    
    $http.post('/type', {label: 'Technical'});
    $http.post('/type', {label: 'General'});
    
    var updateSelectedType = function(value) {
        $("#topic-box").css({"visibility": "visible"});
        selectedType = value;
        currentTopics = types[selectedType].topics;
        currentSubTopics = [];
    };
    
    var updateSelectedTopic = function(topic) {
        selectedTopic = topic;
        currentSubTopics = topic.sub;
    };
    
    var updateSelectedSubTopic = function() {
        
    };
    
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
        
        types[selectedType].topics.forEach(function(topic, index) {
           if(topic.name === name)
                shouldAdd = false; 
        });
        if (shouldAdd) {
            var topicData = {
                type: types[selectedType].name,
                name: name,
                id: types[selectedType].topics.length,
                sub: []
            };
            
            $http.post('/topic',  topicData).success(function(created){
                    console.log(created);
                    console.log(created.topic);
            });
            
            types[selectedType].topics.push({name: name, id: types[selectedType].topics.length, sub: []});
            updateSelectedType(selectedType);
            updateSelectedTopic(types[selectedType].topics[types[selectedType].topics.length - 1]);
        }
        
    };
    
    $http.get('/type').success(function(data) {
        data.types.forEach(function(type, index) {
           types.push({name: type.label, id: types.length, topics: []}); 
        });
    });
    
    $http.get('/topic').success(function (data) {
        data.topics.forEach(function(top, index) {
            types.forEach(function(typ, index) {
               if(typ.name === top.type)
                    typ.topics.push(top);
            });
        });
    });
    
    var createNewSubTopic = function(name) {
        types[selectedType].topics[selectedTopic.id].sub.push(name);
        currentSubTopics = types[selectedType].topics[selectedTopic.id].sub;
    }
    
    var getSelectedTopic = function() {
        return selectedTopic;
    }
    
    return {
      updateSelectedType: updateSelectedType,
      updateSelectedTopic: updateSelectedTopic,
      updateSelectedSubTopic: updateSelectedSubTopic,
      getTypes: getTypes,
      getCurrentTopics: getCurrentTopics,
      getCurrentSubTopics: getCurrentSubTopics,
      createNewTopic: createNewTopic,
      createNewSubTopic: createNewSubTopic,
      getSelectedTopic: getSelectedTopic
    };
}