(angular => {
    "use strict"

    angular
        .module("constructionCup")
        .directive("menuLink", menuLink);

    menuLink.$inject = ["$state"];

    function menuLink($state) {
        const directive = {
            controller: MenuLinkController,
            controllerAs: "vm",
            scope: {},
            restrict: "A"
        };

        return directive;

        function MenuLinkController($scope, $element, $attrs) {
            const vm = this;

            $element.on("click", e => {
                if ($attrs.menuLink === $state.current.name) return;

                $state.go($attrs.menuLink, $state.params);

                return false;
            });
        }
    }
})(window.angular);