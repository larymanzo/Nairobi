sap.ui.define([
        "./BaseController",
        "sap/ui/model/json/JSONModel"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel) {
		"use strict";

		return BaseController.extend("treinamento.l4e.app.controller.ConsultaParceiros", {
			onInit: function () {
                this.getRouter().getRoute("ConsultaParceiros").attachPatternMatched(this.handleRouteMatched, this);

            },
            
            handleRouteMatched: async function(){
                var that = this;

                $.ajax({
                    "url": "/api/parceiros",
                    "method": "GET",
                    success(data){
                        that.getView().setModel(new JSONModel(data), "Parceiros")
                    },
                    error(){

                    }

                })
            },

            onExcluir: function(oEvent){
                var id = oEvent.getParameter('listItem').getBindingContext("Parceiros").getObject().id;
            }
		});
	});
