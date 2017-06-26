function list_position_controller($scope, $http, $location, userService, authService) {
    $scope.sortType = 'id'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order
    $scope.searchPositions = ''; // set the default search/filter term
    $scope.positions = [];

    $scope.name = userService.getUserName();
    $scope.role = userService.getUserRole();

    var loadScreen = function() {
        authService.getUserToken(function(idToken) {
            if ($scope.role != 'Admin' && $scope.role != 'Manager') {
                loadAllPositions(idToken);
            } else {
                loadAllPositions(idToken);
            }
        });
    };

    var loadAllPositions = function(idToken) {
        $http.get('../../position/?idToken=' + idToken).then(function(data) {
            $scope.positions = data.data.positions;
            $scope.positions.forEach(function(p) {
                console.log('name: '+ p.name + ' ' + 'description: '+ p.description);
                stringifyTags(p,idToken);
            });
        });
    };

    var loadPosition = function(position, idToken) {
        $http.get('../../position/').success(function(result) {
            interview.position = result.position.name;
            interview.position += getPositionID({
                type: "Internal",
                info: result.position
            });
        });
    };

    var stringifyTags = function(position, idToken) {
        position.taglist = "";
        $http.get('../../position/' + position.id + '/tags/?idToken=' + idToken).success(function(data) {
           data.tags.forEach(function(tag) {
                console.log(tag.name);
                position.taglist += tag.name + ", ";
           });
           position.taglist = position.taglist.substring(0, position.taglist.length - 2);
        });
    };

    loadScreen();
}
