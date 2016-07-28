function filter_menu_controller ($scope, $rootScope, filterService) {
    $scope.difficulties = [];
    $scope.tags = [];
    
    $rootScope.$on('updateFilter', function(event, args) {
        $scope.difficulties = filterService.getDifficulties();
        $scope.tags = filterService.getTags();
    });
    
    $scope.changeDifficulty = function() {
        filterService.setDifficulties($scope.difficulties);
    }
    
    $scope.changeTag = function() {
        filterService.setTags($scope.tags);    
    }
}