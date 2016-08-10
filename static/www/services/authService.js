function authService() {

    var getUserToken = function(callback) {
        firebase.auth().currentUser.getToken(false).then(function(idToken) {
            callback(idToken);
        }).catch(function(error) {
            // Handle error
        });
    };

    return {
        getUserToken: getUserToken
    }
}