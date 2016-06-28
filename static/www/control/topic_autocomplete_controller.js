function topic_autocomplete_controller($timeout, $q, $log, taggingService) {
    var self = this;
    self.topics = taggingService.getCurrentTopics();
    self.searchText = "";
    self.selectedItem = null;
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;
    self.newTopic = newTopic;
    
    function newTopic(topic) {
        console.log(topic);
    }
    
    function querySearch (query) {
        self.topics = taggingService.getCurrentTopics();
        text = query.toLowerCase();
        var ret = self.topics.filter(function (d) {
            console.log(d.name);
            var test = d.name.toLowerCase();
            return test.startsWith(text);
        });
        return ret;
    }
    function searchTextChange(text) {
        self.topics = taggingService.getCurrentTopics();   
        $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }
  }