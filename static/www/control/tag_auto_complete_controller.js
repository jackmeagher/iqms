function tag_auto_complete_controller (taggingService) {
    var self = this;
    self.tags = taggingService.getTags();
    self.searchText = "";
    self.selectedItem = null;
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.newTag = newTag;

    var mainTags = ['intro', 'skills', 'close', 'inline'];

    function newTag(tag) {
        if (tag) {
            taggingService.createNewTag(tag);
            self.searchText = "";
            self.selectedItem = null;
        }
    }
    
    function querySearch(query) {
        self.tags = $.map(taggingService.getTags(), function(value, index) {
            return value.name; 
        });

        self.tags = removeMainTags(self.tags);

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
    
    function selectedItemChange(item) {
        if (item) {
            taggingService.addTag(item);
            self.searchText = "";
            self.selectedItem = null;
        }
    }

    function removeMainTags(t) {
        mainTags.forEach(function(tag) {
           if(t) {
               if(t.indexOf(tag) > -1) {
                   t.splice(t.indexOf(tag), 1);
               }
           }
        });
        return t;
    }
}