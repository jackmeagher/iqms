function login_controller($scope, $http, userService, authService, $location) {
    $scope.create = false;
    $scope.emailReset = 0;

    $scope.error = null;

    $scope.user = {
        email: "",
        password: ""
    };
    
    $scope.loginUser = function() {
        firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function() {
            $location.path("/");
            $scope.$apply();
        }, function(error) {
            $scope.error = error.message;
            $scope.$apply();
        });
    };
    
    $scope.createUser = function() {
        firebase.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password).then(function() {
            var user = {
                name: $scope.user.email,
                role: "Interviewer"
            };
            userService.setUserRole(user.role);
            authService.getUserToken(function(idToken) {
                $http.post('../../user/?idToken=' + idToken, user).success(function(data) {
                    $location.path("/");
                });
            });
        }, function(error) {
            $scope.error = error.message;
            $scope.$apply();
        });
    };
    
    $scope.resetPassword = function() {
        firebase.auth().sendPasswordResetEmail($scope.user.email).then(function() {
            $scope.emailReset = 2;
        }, function(error) {
            $scope.error = error.message;
            $scope.$apply();
        });
    }
}