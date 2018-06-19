(angular => {
    "use strict"

    angular
        .module("constructionCup")
        .controller("ReportController", ReportController);

    ReportController.$inject = ["$q", "dataConstructionService", "helperService", "settings", "$state"];

    function ReportController($q, dataConstructionService, helperService, settings, $state) {
        const vm = this;

        vm.$onInit = () => {
            loadSelectOptions();
            checkInitialFilters();
        };

        vm.fieldSelectOptions = settings.datapoa.selects.fieldSelectOptions;
        vm.yearSelectOptions = settings.datapoa.selects.yearSelectOptions;
        vm.limitSelectOptions = settings.datapoa.selects.limitSelectOptions;

        vm.getFieldName = (fieldId) => {
            const result = vm.fieldSelectOptions.find(field => {
                return field.id === fieldId;
            });

            return result.name;
        };

        vm.clearFilters = () => {
            vm.fieldList = null;
            vm.year = null;
            vm.company = null;
            vm.construction = null;
        };

        vm.verifyIsNumber = (value) => {
            if (!isNaN(value)) {
                const result = Number(value);

                return helperService.numberToReal(result);
            } else {
                return value;
            }
        };

        vm.search = () => {
            const deferred = $q.defer();
            const promise = deferred.promise;
            const filters = {
                "OBRA": vm.construction && vm.construction.length > 0 ? vm.construction : undefined,
                "NOMEPESSOA": vm.company && vm.company.length > 0 ? vm.company : undefined
            };

            $q.all(helperService.getDataPromises(vm.year, filters, vm.fieldList, settings.datapoa.resources, dataConstructionService.datapoa(), vm.limit))
                .then(response => {
                    const results = helperService.joinArrays(helperService.setYearOnResults(response, vm.year));

                    vm.companyList = results;
                    vm.field = angular.isArray(vm.fieldList) ? vm.fieldList : [vm.fieldList];

                    $state.go($state.current, {
                        fields: vm.fieldList,
                        year: vm.year,
                        company: vm.company,
                        construction: vm.construction
                    }, {
                        location: "replace"
                    });
                })
                .catch(error => {
                    console.log(error);
                });

            return promise;
        };

        vm.getCellWidthStyle = () => helperService.getCellWidthStyle(vm.field.length);

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
            if ($state.params.construction) {
                vm.construction = $state.params.construction;
                doSearch = true;
            }
            if (doSearch) {
                return vm.search();
            }
        }

        function loadSelectOptions() {
            const fieldList = settings.datapoa.field;
            const selectOptionsFilters = ["OBRA", "NOMEPESSOA"];

            $q.all(helperService.getDataPromises(null, null, selectOptionsFilters, settings.datapoa.resources, dataConstructionService.datapoa()))
                .then(response => {
                    const result = helperService.joinArrays(response);

                    vm.constructSelectOptions = helperService.getSelectOptionsData(result, fieldList.construction);
                    vm.companySelectOptions = helperService.getSelectOptionsData(result, fieldList.company);
                });
        }
    }
})(window.angular);