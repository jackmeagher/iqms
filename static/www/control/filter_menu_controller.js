function filter_menu_controller ($scope, $rootScope, filterService, socket) {
    $scope.difficulties = [];
    $scope.tags = [];
    
    $scope.orderBy = [];
    
    $rootScope.$on('updateFilter', function(event, args) {
        $scope.difficulties = filterService.getDifficulties();
        $scope.tags = filterService.getTags();
    });
    
    $scope.changeDifficulty = function() {
        filterService.setDifficulties($scope.difficulties);
        socket.emit('update-filter', {
           tags: $scope.tags,
           difficulties: $scope.difficulties,
           id: filterService.getInterviewId()
        });
    }
    
    $scope.changeTag = function() {
        filterService.setTags($scope.tags);
        socket.emit('update-filter', {
           tags: $scope.tags,
           difficulties: $scope.difficulties,
           id: filterService.getInterviewId()
        });
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
        socket.emit('update-filter', {
           tags: $scope.tags,
           difficulties: $scope.difficulties,
           order: $scope.orderBy,
           id: filterService.getInterviewId()
        });
    }
}