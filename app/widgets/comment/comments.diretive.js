(angular => {
    "use strict"

    angular
        .module("constructionCup")
        .directive("comments", comments);

    comments.$inject = ["$rootScope", "$state", "$timeout", "dataConstructionService"];

    function comments($rootScope, $state, $timeout, dataConstructionService) {
        const directive = {
            controller: CommentsController,
            controllerAs: "vm",
            scope: {},
            templateUrl: "/app/widgets/comment/comments-template.html",
            restrict: "E"
        };

        return directive;

        function CommentsController() {
            const vm = this;

            vm.editCommentAreaOpened = false;
            vm.showComments = false;

            vm.$onInit = () => {
                getAll();
            };

            vm.goToLogin = () => {
                $state.go("login");
            };

            vm.saveComment = () => {
                dataConstructionService
                    .commentCupResource()[getSaveCommentAction()](vm.commentToSave)
                    .$promise
                    .then(response => {
                        vm.message = response.message;
                        vm.editCommentAreaOpened = false;
                        vm.showComments = true;

                        getAll();

                        $timeout(() => {
                            vm.message = null
                        }, 5000);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            };

            vm.openEditCommentArea = (item) => {
                vm.editCommentAreaOpened = true;
                vm.commentToSave = angular.copy(item);
                vm.commentToSave.action = "update";
            };

            vm.openCreateCommentArea = () => {
                vm.editCommentAreaOpened = true;
                vm.commentToSave = {
                    action: "insert"
                };
            };

            vm.deleteComment = (commentId) => {
                const mensage = confirm("Você quer excluir este comentario?");

                if (mensage) {
                    dataConstructionService
                        .commentCupResource()
                        .remove(commentId)
                        .$promise
                        .then(response => {
                            vm.showComments = true;

                            getAll();
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            };

            $rootScope.$watch("username", (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    getAll();
                }
            });

            function getAll() {
                dataConstructionService
                    .commentCupResource()
                    .getAll()
                    .$promise
                    .then(response => {
                        vm.comments = response;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }

            function getSaveCommentAction() {
                return vm.commentToSave.action === "insert" ? "create" : "update";
            }
        }
    }
})(window.angular);