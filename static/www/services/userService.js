function userService($rootScope, $http, $route, authService) {
    var userName = null;
    var userRole = null;

    var setUserName = function(name) {
        userName = name;
        if(name) {
            authService.getUserToken(function(idToken) {
                $http.get('../../user/' + name + "?idToken=" + idToken).success(function (user) {
                    if(user.user) {
                        setUserRole(user.user.role);
                    }
                });
            });
        }
        $rootScope.$emit('updateName');
    }
    
    var getUserName = function() {
        return userName;
    }

    var setUserRole = function(role) {
        userRole = role;
        $route.reload();
    }

    var getUserRole = function() {
        return userRole;
    }
    
    return {
        setUserName: setUserName,
        getUserName: getUserName,
        getUserRole: getUserRole,
        setUserRole: setUserRole
    }
}