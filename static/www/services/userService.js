function userService($rootScope, $http) {
    var userName = null;
    var userRole = null;

    var setUserName = function(name) {
        userName = name;
        if(name) {
            $http.get('/user/' + name).success(function (user) {
                if(user.user) {
                    userRole = user.user.role;
                }
            });
        }
        $rootScope.$emit('updateName');
    }
    
    var getUserName = function() {
        return userName;
    }

    var setUserRole = function(role) {
        userRole = role;
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