/**
 * Created by nick on 4/12/16.
 */
/**
 * Created by nick on 3/31/16.
 */

function login_controller($scope, $http, userService) {
    $scope.create = false;
    $scope.user = {
        email: "",
        password: ""
    };
    $scope.PostLogin = function () {
        $http.post('/user/auth', $scope.user)
            .then(function(data) {
                $scope.show_side();
                if (data.token) {
                    $scope.successful=true;
                }
            });
    }
    
    $scope.loginUser = function() {
        firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
    }
    
    $scope.createUser = function() {
        firebase.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
    }
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log(user);
          userService.setUserName(user.email);
        } else {
          console.log("NONE");
        }
    });
}