(angular => {
    "use strict"

    angular
        .module("constructionCup")
        .constant("settings", {
            datapoa: {
                apiPath: "http://datapoa.com.br/api/action/datastore_search",
                defaultConfig: {
                    limit: "400"
                },
                field: {
                    company: "NOMEPESSOA",
                    construction: "OBRA",
                    valueGross: "VL_BRUTO_PARCPAG",
                    valueNet: "VL_LIQUIDO_PARCPAG",
                    valueRetained: "VL_RETIDO_PARCPAG"
                },
                resources: {
                    obrasCopa: {
                        2011: "fdf4f9bd-e797-4fb9-8bc5-9740528a1601",
                        2012: "87c53633-54f9-4fb4-90d8-5e667f157632",
                        2013: "1dbd81a6-773d-44fb-bf8f-555057cb509c"
                    }
                },
                selects: {
                    fieldSelectOptions: [{
                            id: "OBRA",
                            name: "Obra"
                        },
                        {
                            id: "NOMEPESSOA",
                            name: "Construtora"
                        },
                        {
                            id: "VL_BRUTO_PARCPAG",
                            name: "Valor Bruto"
                        },
                        {
                            id: "VL_RETIDO_PARCPAG",
                            name: "Valor Retido"
                        },
                        {
                            id: "VL_LIQUIDO_PARCPAG",
                            name: "Valor Líquido"
                        }
                    ],
                    yearSelectOptions: [{
                            id: null,
                            name: "Todos"
                        }, {
                            id: 2011,
                            name: 2011
                        },
                        {
                            id: 2012,
                            name: 2012
                        },
                        {
                            id: 2013,
                            name: 2013
                        }
                    ],
                    limitSelectOptions: [{
                            id: "400",
                            name: "Todas"
                        },
                        {
                            id: "6",
                            name: 15
                        },
                        {
                            id: "11",
                            name: 25
                        },
                        {
                            id: "16",
                            name: 35
                        }
                    ]
                }
            }
        });
})(window.angular);