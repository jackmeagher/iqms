function tag_auto_complete_controller ($scope, $timeout, $q, $log, taggingService) {
    var self = this;
    self.tags = taggingService.getCurrentTags();
    self.searchText = "";
    self.selectedItem = null;
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;
    self.newTag = newTag;
    
    function newTag(tag) {
        if (tag) {
            taggingService.createNewTag(tag);
            self.notifySelection();
        }
    }
    
    function querySearch(query) {
        self.tags = taggingService.getCurrentTags();
        if (query == null) {
            query = "";
        }
        text = query.toLowerCase();
        var ret = self.tags.filter(function (d) {
            var test = d.name.toLowerCase();
            return test.startsWith(text);
        });
        return ret;
    }
    
    function searchTextChange(text) {
        self.tags = taggingService.getCurrentTags();
    }
    
    function selectedItemChange(item) {
        if (item) {
            taggingService.addTag(item.name);
            self.notifySelection();
        }
    }
    
    self.notifySelection = function() {
        $scope.$emit("tagNotification", {on: true});
    }
}