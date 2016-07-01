function topic_autocomplete_controller($scope, $timeout, $q, $log, taggingService) {
    var self = this;
    self.topics = taggingService.getCurrentTopics();
    self.searchText = "";
    self.selectedItem = null;
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;
    self.newTopic = newTopic;
    
    function newTopic(topic) {
        if (topic) {
            taggingService.createNewTopic(topic);
            self.notifySelection();
            makeSubVisible('visible');
        }
    }
    
    function querySearch (query) {
        self.topics = taggingService.getCurrentTopics();
        if (query == null) {
            query = "";
        }
        text = query.toLowerCase();
        var ret = self.topics.filter(function (d) {
            var test = d.name.toLowerCase();
            return test.startsWith(text);
        });
        return ret;
    }
    function searchTextChange(text) {
        self.topics = taggingService.getCurrentTopics();
    }
    
    function selectedItemChange(item) {
      if (item) {
        taggingService.updateSelectedTopic(item);
        self.notifySelection();
        makeSubVisible('visible');
      } else {
        makeSubVisible('hidden');
      }
    }
    
    self.notifySelection = function() {
        $scope.$emit("topicNotification", {on: true});
    }
    
    function makeSubVisible(visible) {
        $("#subtopic-box").css({"visibility": visible});  
    }
  }