function taggingService() {

    var currentTopics = [];
    var currentSubTopics = [];
    
    var selectedType = 0;
    var selectedTopic = null;
    
    var types = [
        {
            name: "Technical",
            id: 0,
            topics: [
                {
                    name: "Java",
                    id: 0,
                    sub: ["Classes", "Inheritance", "Libraries"]
                },
                {
                    name: "PHP",
                    id: 1,
                    sub: ["Syntax", "Variables"]
                }
            ]    
        },
        {
            name: "General",
            id: 1,
            topics: [
                {
                    name: "Test",
                    id: 0,
                    sub: ["Foo", "Bar"]
                },
                {
                    name: "Test2",
                    id: 1,
                    sub: ["This", "Some of This", "More of This", "That"]
                }
            ]
        }
    ];
    
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
        types[selectedType].topics.push({name: name, sub: []});
        updateSelectedType(selectedType);
    };
    
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