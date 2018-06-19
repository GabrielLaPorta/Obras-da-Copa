(angular => {
    "use strict"

    angular
        .module("constructionCup")
        .controller("StatisticsContructionController", StatisticsContructionController);

    StatisticsContructionController.$inject = ["$q", "dataConstructionService", "helperService", "settings", "$state"];

    function StatisticsContructionController($q, dataConstructionService, helperService, settings, $state) {
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
            vm.construction = null;
        };

        vm.search = () => {
            const deferred = $q.defer();
            const promise = deferred.promise;
            const filters = {
                "OBRA": vm.construction && vm.construction.length > 0 ? vm.construction : undefined
            };

            $state.go($state.current, {
                fields: vm.fieldList,
                year: vm.year,
                construction: vm.construction
            }, {
                location: "replace"
            });

            loadCharts();

            $q.all(helperService.getDataPromises(vm.year, filters, vm.fieldList, settings.datapoa.resources, dataConstructionService.datapoa()))
                .then(response => {
                    const results = helperService.joinArrays(helperService.setYearOnResults(response, vm.year));
                    const fieldList = settings.datapoa.field;
                    //Total gasto em obras
                    const groupingConstruction = helperService
                        .groupingFields(results, fieldList.construction);
                    const grossEachConstruction = helperService
                        .sumByConstructions(groupingConstruction, fieldList.valueGross);
                    const retainedEachConstruction = helperService
                        .sumByConstructions(groupingConstruction, fieldList.valueRetained);
                    const netEachConstruction = helperService
                        .sumByConstructions(groupingConstruction, fieldList.valueNet);
                    //Passando valores para o grafico
                    const constructionFiltered = helperService.filterFields([Object.keys(groupingConstruction)]);
                    vm.chartAllConstruction.data.labels = helperService.abrevLabels(constructionFiltered, 25);

                    vm.chartAllConstruction.data.datasets[0].data = Object.values(netEachConstruction);
                    vm.chartAllConstruction.data.datasets[1].data = Object.values(retainedEachConstruction);
                    vm.chartAllConstruction.data.datasets[2].data = Object.values(grossEachConstruction);

                    vm.chartAllConstruction.update();
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
            if ($state.params.construction) {
                vm.construction = $state.params.construction;
                doSearch = true;
            }
            if (doSearch) {
                return vm.search();
            }
        }

        function loadCharts() {
            const chartContainer = document.querySelector("article#chart-container-construction");
            let chartContent = chartContainer.querySelector("canvas#chart-content-construction");

            if (chartContent) {
                chartContent.remove();
            }

            chartContent = document.createElement("canvas");
            chartContent.setAttribute("id", "chart-content-construction");
            chartContainer.appendChild(chartContent);

            vm.chartAllConstruction = new Chart(chartContent, {
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
                                    (value, index, values) => {
                                        return helperService.numberToReal(value);
                                    }
                            }
                        }]
                    },
                    tooltips: {
                        callbacks: {
                            label: (item, data) => {
                                return helperService.numberToReal(item.yLabel);
                            }
                        }
                    }
                }
            });
        }

        function loadSelectOptions() {
            const fieldList = settings.datapoa.field;
            const selectOptionsFilters = ["OBRA"];

            $q.all(helperService.getDataPromises(null, null, selectOptionsFilters, settings.datapoa.resources, dataConstructionService.datapoa()))
                .then(response => {
                    const result = helperService.joinArrays(response);

                    vm.constructSelectOptions = helperService.getSelectOptionsData(result, fieldList.construction);
                });
        }
    }
})(window.angular);