(angular => {
    "use strict"

    angular
        .module("constructionCup")
        .config(['$resourceProvider', $resourceProvider => {
            $resourceProvider.defaults.actions = {
                create: {
                    method: "POST"
                },
                get: {
                    method: "GET"
                },
                getAll: {
                    method: 'GET',
                    isArray: true
                },
                update: {
                    method: 'PUT'
                },
                remove: {
                    method: 'DELETE'
                }
            };
        }]);
})(window.angular);