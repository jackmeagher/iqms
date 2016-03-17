/**
 * Created by James on 3/2/2016.
 */
registerController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
function registerController(UserService, $location, $rootScope, FlashService) {
    var vm = this;

    vm.register = register;

    function register() {
        vm.dataLoading = true;
        UserService.create(vm.user)
            .then(function (response) {
                if (response.success) {
                    FlashService.Success('Registration successful', true);
                    $location.path('/index');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
    }
}

