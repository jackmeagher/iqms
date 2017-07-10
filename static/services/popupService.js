function popupService($mdDialog, $mdMedia, $rootScope) {
    var status = '  ';
    var customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    
    var title = "";
    var content = "";
    var placeholder = "";
    var initial = "";
    
    var value = null;
    
    var showPrompt = function(ev, callback) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
          .title(title)
          .textContent(content)
          .placeholder(placeholder)
          .ariaLabel(placeholder)
          .initialValue(initial)
          .targetEvent(ev)
          .ok('Submit')
          .cancel('Cancel');
        $mdDialog.show(confirm).then(function(result) {
            value = result;
            callback();
        }, function() {
            value = null;
            callback();
        });
    };
    
    var init = function(t, c, p, i) {
        title = t;
        content = c;
        placeholder = p;
        initial = i;
    }
    
    var getResult = function() {
        return value;
    }
    
    return {
        showPrompt: showPrompt,
        init: init,
        getResult: getResult
    }
}