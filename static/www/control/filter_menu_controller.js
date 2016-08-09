function filter_menu_controller ($scope, $rootScope, $http, $mdDialog, $routeParams, filterService, socket, popupService, taggingService) {
    $scope.difficulties = [];
    $scope.tags = [];
    
    $scope.orderBy = [];

    $scope.selectedTag = null;
    $scope.tagText = "";

    taggingService.resetTags();

    $rootScope.$on('updateFilter', function(event, args) {
        $scope.difficulties = filterService.getDifficulties();
        $scope.tags = filterService.getTags();
        $scope.orderBy = filterService.getOrderBy();
    });
    
    $scope.changeDifficulty = function() {
        filterService.setDifficulties($scope.difficulties);
        $scope.emitRequest();
    }
    
    $scope.changeTag = function() {
        filterService.setTags($scope.tags);
        $scope.emitRequest();
    }
    
    $scope.changeFilter = function(id) {
        switch (id) {
            case(0):
                $scope.orderBy = ["tags", "difficulty"];
                break;
            case(1):
                $scope.orderBy = ["difficulty", "tags"];
                break;
        }
        filterService.setOrderBy($scope.orderBy);
        $scope.emitRequest();
    }
    
    $scope.emitRequest = function() {
        socket.emit('update-filter', {
           tags: $scope.tags,
           difficulties: $scope.difficulties,
           order: $scope.orderBy,
           id: filterService.getInterviewId()
        });  
    }

    $scope.alterAllTags = function(all) {
        if(all) {
            $scope.tags.forEach(function(tag, index) {
               tag.checked = true;
            });
        } else {
            $scope.tags.forEach(function(tag, index) {
                tag.checked = false;
            });
        }
        filterService.setTags($scope.tags);
        $scope.emitRequest();
    }

    $scope.addInterviewTag = function(ev) {
        $scope.tagList = taggingService.getTags();
        $scope.showTagDialog(ev);
    }

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
    }

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
    }

    $scope.tagTextChange = function(text) {
        var pos = $.map($scope.tagList, function(value, index) {
            return value.name;
        });
    }

    $scope.tagItemChange = function(item) {
        if (item) {
            $scope.selectedTag = item;
        }
    }

    function removeMainTags(t) {
        if(t) {
            if(t.indexOf('Intro') > -1) {
                t.splice(t.indexOf('Intro'), 1);
            }
            if(t.indexOf('Skills') > -1) {
                t.splice(t.indexOf('Skills'), 1);
            }
            if(t.indexOf('Close') > -1) {
                t.splice(t.indexOf('Close'), 1);
            }
            if(t.indexOf('Inline') > -1) {
                t.splice(t.indexOf('Inline'), 1);
            }
        }
        return t;
    }

    function removeSelectedTags(t) {
        $scope.tags.forEach(function(tag, index) {
            if(t.indexOf(tag.label) > -1) {
                t.splice(t.indexOf(tag.label), 1);
            }
        });
        return t;
    }

    $scope.addTheTag = function() {
        $scope.tags.push({checked: true, label: $scope.selectedTag});
        $http.post('/tag/' + $scope.selectedTag
            + '/interview/' + $routeParams.id).success(function(created) {
        });
        $mdDialog.hide();
    }
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