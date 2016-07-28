function filter_menu_controller ($scope, $rootScope, filterService, socket) {
    $scope.difficulties = [];
    $scope.tags = [];
    
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
}