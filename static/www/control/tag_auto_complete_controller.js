function tag_auto_complete_controller ($scope, $timeout, $q, $log, taggingService) {
    var self = this;
    self.tags = taggingService.getTags();
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
        self.tags = $.map(taggingService.getTags(), function(value, index) {
            return value.name; 
        });
        if (query == null) {
            query = "";
        }
        text = query.toLowerCase();
        var ret = self.tags.filter(function (d) {
            var test = d.toLowerCase();
            return test.startsWith(text);
        });
        return ret;
    }
    
    function searchTextChange(text) {
        self.tags = $.map(taggingService.getTags(), function(value, index) {
            return value.name; 
        });
    }
    
    function selectedItemChange(item) {
        if (item) {
            taggingService.addTag(item);
            self.notifySelection();
        }
    }
    
    self.notifySelection = function() {
        $scope.$emit("tagNotification", {on: true});
    }
}