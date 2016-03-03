/**
 * Created by James on 3/2/2016.
 */

/**
 * my own version of data_insertion for registering users
 *
 * commented out various service calls for things that are not implemented yet
 *
 * NOTE: I had to extend user.create in routes/index.js since it was unimplemented
 *
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};

        //service.GetAll = GetAll;
        //service.GetById = GetById;
        service.Create = Create;
        //service.Update = Update;
        //service.Delete = Delete;

        return service;

        //function GetAll() {
        //    return $http.get('http://127.0.0.1:3000/user').then(handleSuccess, handleError('Error getting all users'));
        //}

        //function GetById(id) {
        //    return $http.get('http://127.0.0.1:3000/user' + id).then(handleSuccess, handleError('Error getting user by id'));
        //}

        //function GetByUsername(username) {
        //    return $http.get('http://127.0.0.1:3000/user' + username).then(handleSuccess, handleError('Error getting user by username'));
        //}

        function Create(user) {
            return $http.post('http://127.0.0.1:3000/user', user).then(handleSuccess, handleError('Error creating user'));
        }

        //function Update(user) {
        //    return $http.put('http://127.0.0.1:3000/user' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        //}

        //function Delete(id) {
        //    return $http.delete('http://127.0.0.1:3000/user' + id).then(handleSuccess, handleError('Error deleting user'));
        //}

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();