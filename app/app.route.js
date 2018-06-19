(angular => {
    "use strict"

    angular
        .module("route", ["ui.router"])
        .config((
            $stateProvider,
            $locationProvider,
            $urlRouterProvider,
            $urlMatcherFactoryProvider
        ) => {
            const rootPath = "/app";

            //HTML5 mode
            $locationProvider.html5Mode(true);

            //Case Insensitive
            $urlMatcherFactoryProvider.caseInsensitive(true);

            $urlRouterProvider.otherwise(`${rootPath}/inicio`);

            //routes
            $stateProvider
                .state("home", {
                    templateUrl: "/app/screens/home/home-template.html",
                    url: `${rootPath}/inicio`
                })
                .state("report", {
                    controller: "ReportController",
                    controllerAs: "vm",
                    params: {
                        field: {
                            dynamic: true
                        },
                        year: {
                            dynamic: true
                        },
                        construction: {
                            dynamic: true
                        },
                        company: {
                            dynamic: true
                        }
                    },
                    templateUrl: "/app/screens/report/report-template.html",
                    url: `${rootPath}/relatorio?fields&year&construction&company`
                })
                .state("constructionStatistics", {
                    controller: "StatisticsContructionController",
                    controllerAs: "vm",
                    params: {
                        fields: {
                            dynamic: true
                        },
                        year: {
                            dynamic: true
                        },
                        construction: {
                            dynamic: true
                        }
                    },
                    templateUrl: "/app/screens/statistics/construction/statistic-construction-template.html",
                    url: `${rootPath}/estatisticas-obra?fields&year&construction`
                })
                .state("companyStatistics", {
                    controller: "StatisticsCompanyController",
                    controllerAs: "vm",
                    params: {
                        fields: {
                            dynamic: true
                        },
                        year: {
                            dynamic: true
                        },
                        company: {
                            dynamic: true
                        }
                    },
                    templateUrl: "/app/screens/statistics/company/statistic-company-template.html",
                    url: `${rootPath}/estatisticas-construtora?fields&year&company`
                })
                .state("insertUser", {
                    controller: "InsertUserController",
                    controllerAs: "vm",
                    templateUrl: "/app/screens/authentication/insert/insert-template.html",
                    url: `${rootPath}/salvar-usuario`
                })
                .state("login", {
                    controller: "LoginController",
                    controllerAs: "vm",
                    templateUrl: "/app/screens/authentication/login/login-template.html",
                    url: `${rootPath}/entrar`
                });
        });
})(window.angular);