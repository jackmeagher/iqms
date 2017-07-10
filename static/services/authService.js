function authService() {
    var getUserToken = function(callback) {
        if(firebase.auth().currentUser) {
            firebase.auth().currentUser.getToken(false).then(function(idToken) {
                callback(idToken);
            }).catch(function(error) {
                // Handle error
            });
        }

    };

    return {
        getUserToken: getUserToken
    }
}