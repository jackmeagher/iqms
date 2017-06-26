function filter_menu_controller ($scope, $rootScope, $http, $mdDialog, $routeParams,
                                 filterService, socket, authService, taggingService) {
    $scope.difficulties = [];
    $scope.tags = [];
    
    $scope.orderBy = [];

    $scope.selectedTag = null;
    $scope.tagText = "";

    var mainTags = ['intro', 'skills', 'close', 'inline'];

    $scope.changeFilter = function(id) {
        switch (id) {
            case(0):
                $scope.orderBy = ["tags", "difficulty"];
                break;
            case(1):
                $scope.orderBy = ["difficulty", "tags"];
                break;
        }
        socket.emit('update-order', {id: filterService.getInterviewId(), orderBy: $scope.orderBy});
    };
    

    $rootScope.$on('updateFilter', function() {
        $scope.difficulties = filterService.getDifficulties();
        $scope.tags = filterService.getTags();
        $scope.orderBy = filterService.getOrderBy();
    });

    $rootScope.$on('tagNotification', function() {
        $scope.tagList = taggingService.getTags();
    });

    $scope.changeDifficulty = function(index) {
        socket.emit('update-diff', {id: filterService.getInterviewId(), index: index});
    };
    
    $scope.changeTag = function(index) {
        socket.emit('update-tags', {id: filterService.getInterviewId(), index: index});
    };

    $scope.alterAllTags = function(all) {
        socket.emit('update-all-tags', {id: filterService.getInterviewId(), value: all});
    };

    $scope.addInterviewTag = function(ev) {
        taggingService.resetTags();
        $scope.tagList = taggingService.getTags();
        $scope.selectedTag = null;
        $scope.tagText = "";
        $scope.showTagDialog(ev);
    };

    $scope.showTagDialog = function(ev) {
        $mdDialog.show({
            controller: DialogController,
            contentElement: '#myDialog',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };

    $scope.queryTag = function(query) {
        var pos = $.map($scope.tagList, function(value, index) {
            return value.name;
        });
        pos = removeMainTags(pos);
        pos = removeSelectedTags(pos);
        return $scope.queryFunction(query, pos);
    };

    $scope.queryFunction = function(query, data) {
        if (query == null) {
            query = "";
        }

        text = query.toLowerCase();
        var ret = data.filter(function(d) {
            var test = d.toLowerCase();
            return test.startsWith(text);
        });
        return ret;
    };

    $scope.tagItemChange = function(item) {
        if (item) {
            $scope.selectedTag = item;
        }
    };

    var removeMainTags = function(t) {
        mainTags.forEach(function(tag) {
           if(t) {
               if(t.indexOf(tag) > -1) {
                   t.splice(t.indexOf(tag), 1);
               }
           }
        });
        return t;
    };

    var removeSelectedTags = function(t) {
        $scope.tags.forEach(function(tag) {
            if(t.indexOf(tag.label) > -1) {
                t.splice(t.indexOf(tag.label), 1);
            }
        });
        return t;
    };

    $scope.addTheTag = function() {
        if($scope.selectedTag) {
            socket.emit('add-tag', {tag: {checked: true, label: $scope.selectedTag}, id: filterService.getInterviewId()});
            authService.getUserToken(function(idToken) {
                $http.post('../../tag/' + $scope.selectedTag
                    + '/interview/' + $routeParams.id + "?idToken=" + idToken).success(function(created) {
                });
            });
        }
        $mdDialog.hide();
    };

    taggingService.resetTags();
}

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}