(angular => {
    "use strict"

    angular
        .module("constructionCup")
        .controller("InsertUserController", InsertUserController);

    InsertUserController.$inject = ["$rootScope", "$state", "dataConstructionService"];

    function InsertUserController($rootScope, $state, dataConstructionService) {
        const vm = this;

        vm.saveUser = () => {
            dataConstructionService
                .userSignUpResource()
                .create(vm.insertUser)
                .$promise
                .then(response => {
                    if (response.user) {
                        $rootScope.username = response.user.username;
                        $state.go("home");
                    } else {
                        vm.message = "Nome de usuário existente";
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        };
    }
})(window.angular);