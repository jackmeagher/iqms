function manage_user_controller($scope, $http, $location, userService) {

    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchUser  = '';     // set the default search/filter term

    $scope.users = [];
    $scope.roleList = ["Interviewer", "Manager", "Admin"];

    $scope.name = userService.getUserName();
    $scope.role = userService.getUserRole();
    
    $scope.updateUser = function(user) {
        $http.put('/user/' + user.name, user).success(function(user) {
           $http.get('/user/').success(function(data) {
               $scope.users = data.users;
           });
        });
    }

    $scope.deleteUser = function(user) {
        $http.delete('/user/' + user).success(function() {
            $http.get('/user/').success(function(data) {
                $scope.users = data.users;
            });
        });
    };

    $scope.loadScreen = function() {
        $http.get('/user/').success(function(data) {
            $scope.users = data.users;
        });
    }

    $scope.loadScreen();
};
