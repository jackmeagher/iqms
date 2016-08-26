function manage_user_controller($scope, $http, authService, userService) {

    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchUser  = '';     // set the default search/filter term

    $scope.users = [];
    $scope.roleList = ["Interviewer", "Manager", "Admin"];

    $scope.role = userService.getUserRole();
    
    $scope.updateUser = function(user) {
        authService.getUserToken(function(idToken) {
            $http.put('../../user/' + user.name + "?idToken=" + idToken, user).success(function(user) {
                loadUserList(idToken);
            });
        });
    }

    $scope.deleteUser = function(user) {
        authService.getUserToken(function(idToken) {
            $http.delete('../../user/' + user + "?idToken=" + idToken).success(function() {
                loadUserList(idToken);
            });
        });
    };

    var loadScreen = function() {
        authService.getUserToken(loadUserList);
    };

    var loadUserList = function(idToken) {
        $http.get('../../user/?idToken=' + idToken).success(function(data) {
            $scope.users = data.users;
        });
    };

    loadScreen();
}
