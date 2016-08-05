function filter_menu_controller ($scope, $rootScope, $http, $routeParams, filterService, socket, popupService) {
    $scope.difficulties = [];
    $scope.tags = [];
    
    $scope.orderBy = [];
    
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

    $scope.addInterviewTag = function() {
        popupService.init("Tag", "Add tag to interview ", "" ,"");
        popupService.showPrompt(this, function() {
            var interviewId = $routeParams.id;
            var tag = {};
            tag.label = popupService.getResult();
            tag.checked = true;
            $scope.tags.push(tag);
            filterService.setTags($scope.tags);
            console.log($scope.tags);
            $scope.emitRequest();
            $http.post('/tag/' + tag.label
                + '/interview/' + interviewId).success(function(created) {
            });
        });
    }
}