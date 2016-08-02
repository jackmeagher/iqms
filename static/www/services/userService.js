function userService($rootScope) {
    var userName = null;
    
    var setUserName = function(name) {
        userName = name;
        $rootScope.$emit('updateName');
    }
    
    var getUserName = function() {
        return userName;
    }
    
    return {
        setUserName: setUserName,
        getUserName: getUserName
    }
}