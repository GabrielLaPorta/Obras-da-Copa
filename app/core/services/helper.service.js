(angular => {
    "use strict"

    angular
        .module("constructionCup")
        .factory("helperService", helperService);

    function helperService() {
        return {
            abrevLabels: abrevLabels,
            addYear: addYear,
            filterFields: filterFields,
            getCellWidthStyle: getCellWidthStyle,
            getDataPromises: getDataPromises,
            getResourceByYear: getResourceByYear,
            getSelectOptionsData: getSelectOptionsData,
            groupingFields: groupingFields,
            joinArrays: joinArrays,
            numberToReal: numberToReal,
            setYearOnResults: setYearOnResults,
            sum: sum,
            sumByConstructions: sumByConstructions
        };

        function addYear(arr, year) {
            return arr.map(item => {
                item.ano = year;

                return item;
            });
        }

        //Found in https://stackoverflow.com/questions/14446511/what-is-the-most-efficient-method-to-groupby-on-a-javascript-array-of-objects
        function groupingFields(xs, key) {
            return xs.reduce((rv, x) => {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        }

        function sum(arr, value) {
            return arr
                .map(item => parseFloat(item[value] || 0))
                .reduce((a, b) => a + b);
        }

        function sumByConstructions(constructionList, field) {
            let result = {};

            for (const key in constructionList) {
                if (!constructionList.hasOwnProperty(key)) return result;
                result[key] = sum(constructionList[key], field);
            }

            return result;
        }

        function numberToReal(number) {
            const result = number.toFixed(2).split(".");

            result[0] = "R$ " + result[0].split(/(?=(?:...)*$)/).join(".");

            return result.join(",");
        }

        function joinArrays(data) {
            const result = [];

            data.forEach(item => {
                Array.prototype.push.apply(result, item.result.records);
            });

            return result;
        }

        function getSelectOptionsData(data, field) {
            const selectOptions = [{
                id: null,
                name: "Todos"
            }];

            data.forEach(option => {
                if (!selectOptions.find(item => item.id === option[field])) {
                    selectOptions.push({
                        id: option[field],
                        name: option[field]
                    });
                }
            });

            return selectOptions;
        }

        function setYearOnResults(data, year) {
            if (year) {
                addYear(data[0].result.records, year);
            }

            return data;
        }

        function getResourceByYear(selectedYear, datapoaResources) {
            const result = [];
            const resourceList = datapoaResources.obrasCopa;

            if (selectedYear) {
                result.push(resourceList[selectedYear]);
            } else {
                result.push(resourceList[2011]);
                result.push(resourceList[2012]);
                result.push(resourceList[2013]);
            }

            return result;
        }

        function filterFields(fields) {
            const result = [];

            for (let i = 0; i < fields[0].length; i++) {
                if (i < 6) {
                    result.push(fields[0][i]);
                }
            }

            return result;
        }

        function getDataPromises(year, filters, fieldList, datapoaResources, datapoaRequest, limit) {
            const result = [];
            let defaultParams = {};
            let fields = angular.copy(fieldList);
            const resourceList = getResourceByYear(year, datapoaResources);

            if (filters) {
                defaultParams = angular.extend({
                    filters: filters
                });
            }

            if (fields) {
                if (angular.isArray(fields)) {
                    fields = fields.length === 1 ? fields[0] : fields.join(",");
                }

                defaultParams = angular.extend(defaultParams, {
                    fields: fields,
                    limit: "400"
                });
            }

            if (limit) {
                defaultParams = angular.extend(defaultParams, {
                    limit: limit
                });
            } else {
                defaultParams = angular.extend(defaultParams, {
                    limit: "400"
                });
            }

            resourceList.forEach(item => {
                result.push(datapoaRequest.get(angular.extend(defaultParams, {
                    resource_id: item
                })).$promise);
            });

            return result;
        }

        function abrevLabels(labels, size) {
            const result = [];

            labels.forEach(str => {
                if (str.length >= size + 3) {
                    result.push(str.substring(0, size).concat('...'));
                } else {
                    result.push(str);
                }
            });

            return result;
        }

        function getCellWidthStyle(fieldsCount) {
            return {
                width: `${100 / fieldsCount}%`
            };
        };

    }
})(window.angular);