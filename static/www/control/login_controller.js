/**
 * Created by nick on 4/12/16.
 */
/**
 * Created by nick on 3/31/16.
 */

function login_controller($scope, $http) {
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
}