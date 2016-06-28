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
                    sub: ["Classes", "Inheritance", "Libraries"]
                },
                {
                    name: "PHP",
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
                    sub: ["Foo", "Bar"]
                },
                {
                    name: "Test2",
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
    
    return {
      updateSelectedType: updateSelectedType,
      updateSelectedTopic: updateSelectedTopic,
      updateSelectedSubTopic: updateSelectedSubTopic,
      getTypes: getTypes,
      getCurrentTopics: getCurrentTopics,
      getCurrentSubTopics: getCurrentSubTopics
    };
}