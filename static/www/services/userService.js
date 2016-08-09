function userService($rootScope, $http) {
    var userName = null;
    var userRole = null;

    var setUserName = function(name) {
        userName = name;
        if(name) {
            $http.get('/user/' + name).success(function (user) {
                userRole = user.user.role;
                console.log(userRole);
            });
        }
        $rootScope.$emit('updateName');
    }
    
    var getUserName = function() {
        return userName;
    }

    var getUserRole = function() {
        return userRole;
    }
    
    return {
        setUserName: setUserName,
        getUserName: getUserName,
        getUserRole: getUserRole
    }
}