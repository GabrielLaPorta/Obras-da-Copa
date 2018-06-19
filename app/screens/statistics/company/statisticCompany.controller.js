(angular => {
    "use strict"

    angular
        .module("constructionCup")
        .controller("StatisticsCompanyController", StatisticsCompanyController);

    StatisticsCompanyController.$inject = ["$q", "dataConstructionService", "helperService", "settings", "$state"];

    function StatisticsCompanyController($q, dataConstructionService, helperService, settings, $state) {
        const vm = this;

        vm.$onInit = () => {
            loadSelectOptions();
            checkInitialFilters();
        };

        vm.fieldSelectOptions = settings.datapoa.selects.fieldSelectOptions;
        vm.yearSelectOptions = settings.datapoa.selects.yearSelectOptions;
        vm.limitSelectOptions = settings.datapoa.selects.limitSelectOptions;

        vm.clearFilters = () => {
            vm.fieldList = null;
            vm.year = null;
            vm.company = null;
        };

        vm.search = () => {
            const deferred = $q.defer();
            const promise = deferred.promise;
            const filters = {
                "NOMEPESSOA": vm.company && vm.company.length > 0 ? vm.company : undefined
            };

            $state.go($state.current, {
                fields: vm.fieldList,
                year: vm.year,
                company: vm.company
            }, {
                location: "replace"
            });

            loadCharts();

            $q.all(helperService.getDataPromises(vm.year, filters, vm.fieldList, settings.datapoa.resources, dataConstructionService.datapoa()))
                .then(response => {
                    const results = helperService.joinArrays(helperService.setYearOnResults(response, vm.year));
                    const fieldList = settings.datapoa.field;
                    //Total gasto com construtora
                    const groupingCompany = helperService
                        .groupingFields(results, fieldList.company);
                    const grossEachCompany = helperService
                        .sumByConstructions(groupingCompany, fieldList.valueGross);
                    const retainedEachCompany = helperService
                        .sumByConstructions(groupingCompany, fieldList.valueRetained);
                    const netEachCompany = helperService
                        .sumByConstructions(groupingCompany, fieldList.valueNet);
                    //Passando valores para o grafico
                    const companyFiltered = helperService.filterFields([Object.keys(groupingCompany)]);
                    vm.chartAllCompany.data.labels = helperService.abrevLabels(companyFiltered, 21);

                    vm.chartAllCompany.data.datasets[0].data = Object.values(netEachCompany);
                    vm.chartAllCompany.data.datasets[1].data = Object.values(retainedEachCompany);
                    vm.chartAllCompany.data.datasets[2].data = Object.values(grossEachCompany);

                    vm.chartAllCompany.update();
                    vm.companyList = results;
                    vm.field = vm.fieldList;
                })
                .catch(error => {
                    console.log(error);
                });

            return promise;
        };

        function checkInitialFilters() {
            let doSearch = false;

            if ($state.params.fields) {
                vm.fieldList = angular.isArray($state.params.fields) ? $state.params.fields : [$state.params.fields];
                doSearch = true;
            }
            if ($state.params.year) {
                vm.year = $state.params.year;
                doSearch = true;
            }
            if ($state.params.company) {
                vm.company = $state.params.company;
                doSearch = true;
            }
            if (doSearch) {
                return vm.search();
            }
        }

        function loadCharts() {
            const chartContainer = document.querySelector("article#chart-container");
            let chartContent = chartContainer.querySelector("canvas#chart-content");

            if (chartContent) {
                chartContent.remove();
            }

            chartContent = document.createElement("canvas");
            chartContent.setAttribute("id", "chart-content");
            chartContainer.appendChild(chartContent);

            vm.chartAllCompany = new Chart(chartContent, {
                type: "bar",
                data: {
                    datasets: [{
                            label: "Valor Líquido",
                            backgroundColor: "#548ADB"
                        },
                        {
                            label: "Valor Retido",
                            backgroundColor: "#D7E64A"
                        },
                        {
                            label: "Valor Bruto",
                            backgroundColor: "#1C8E3B"
                        }
                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                callback:
                                    (value) => {
                                        return helperService.numberToReal(value);
                                    }
                            }
                        }]
                    },
                    tooltips: {
                        callbacks: {
                            label: (item) => {
                                return helperService.numberToReal(item.yLabel);
                            }
                        }
                    }
                }
            });
        }

        function loadSelectOptions() {
            const fieldList = settings.datapoa.field;
            const selectOptionsFilters = ["NOMEPESSOA"];

            $q.all(helperService.getDataPromises(null, null, selectOptionsFilters, settings.datapoa.resources, dataConstructionService.datapoa()))
                .then(response => {
                    const result = helperService.joinArrays(response);

                    vm.companySelectOptions = helperService.getSelectOptionsData(result, fieldList.company);
                });
        }
    }
})(window.angular);