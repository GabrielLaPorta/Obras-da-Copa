(angular => {
    "use strict"

    angular
        .module("constructionCup")
        .directive("menu", menu);

    menu.$inject = ["$rootScope", "dataConstructionService"];

    function menu($rootScope, dataConstructionService) {
        const directive = {
            controller: MenuController,
            controllerAs: "vm",
            link: link,
            scope: {},
            templateUrl: "/app/widgets/menu/menu-template.html",
            restrict: "E"
        };

        return directive;

        function MenuController() {
            const vm = this;

            vm.$onInit = () => {
                getProfile();
            };

            function getProfile() {
                dataConstructionService
                    .userProfileResource()
                    .get()
                    .$promise
                    .then(response => {
                        $rootScope.username = response.user;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }

        function link(scope, element, attrs) {
            scope.logout = () => {
                dataConstructionService
                    .userLogoutResource()
                    .update()
                    .$promise
                    .then(response => {
                        $rootScope.username = null;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            };
        }
    }
})(window.angular);