(angular => {
    "use strict"

    angular
        .module("constructionCup")
        .config(($httpProvider) => {
            $httpProvider.useApplyAsync(true);
        });
})(window.angular);