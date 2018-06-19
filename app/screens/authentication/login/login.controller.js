(angular => {
    "use strict"

    angular
        .module("constructionCup")
        .controller("LoginController", LoginController);

    LoginController.$inject = ["$rootScope", "$state", "dataConstructionService"];

    function LoginController($rootScope, $state, dataConstructionService) {
        const vm = this;

        vm.loginUser = () => {
            dataConstructionService
                .userLoginResource()
                .get(vm.login)
                .$promise
                .then(response => {
                    if (response.user) {
                        $rootScope.username = response.user.username;
                        $state.go("home");
                    } else {
                        vm.message = "Usuário ou senha inválido";
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        };
    }
})(window.angular);