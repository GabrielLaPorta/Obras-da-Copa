(angular => {
    "use strict"

    angular
        .module("constructionCup")
        .factory("dataConstructionService", dataConstructionService);

    dataConstructionService.$inject = ["$resource", "settings"];

    function dataConstructionService($resource, settings) {
        const rootApiPath = "/api/v1";
        const clientHost = "http://localhost:3000";

        return {
            datapoa: datapoa,
            userSignUpResource: userSignUpResource,
            userLoginResource: userLoginResource,
            userLogoutResource: userLogoutResource,
            userProfileResource: userProfileResource,
            commentCupResource: commentCupResource
        };

        function datapoa() {
            return $resource(settings.datapoa.apiPath);
        }

        function userSignUpResource() {
            return $resource(`${clientHost}${rootApiPath}/users/signup`);
        }

        function userLoginResource() {
            return $resource(`${clientHost}${rootApiPath}/users/login`);
        }

        function userLogoutResource() {
            return $resource(`${clientHost}${rootApiPath}/users/logout`);
        }

        function userProfileResource() {
            return $resource(`${clientHost}${rootApiPath}/users/profile`);
        }

        function commentCupResource() {
            return $resource(`${clientHost}${rootApiPath}/comments`);
        }
    }
})(window.angular);