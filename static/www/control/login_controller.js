function login_controller($scope, $http, userService, authService, $location) {
    $scope.create = false;
    $scope.emailReset = 0;
    
    $scope.user = {
        email: "",
        password: ""
    };
    
    $scope.loginUser = function() {
        firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function() {
            $location.path("/");
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
                $http.post('/user/?idToken=' + idToken, user).success(function(data) {
                    $location.path("/");
                });
            });
        });
    };
    
    $scope.resetPassword = function() {
        firebase.auth().sendPasswordResetEmail($scope.user.email).then(function() {
            $scope.emailReset = 2;
        }, function(error) {
            console.error(error);
        });
    }
}