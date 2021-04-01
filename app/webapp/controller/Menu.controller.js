sap.ui.define([
		"./BaseController"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController) {
		"use strict";

		return BaseController.extend("treinamento.l4e.app.controller.Menu", {
			onInit: function () {

            },
            
            // Função do botão de "Consulta de Parceiros"
            onNavConsultaParceiros: function(){
                this.getRouter().navTo("ConsultaParceiros");
            },
            
            // Função do botão de "Cadastro de Parceiros"
            onNavCadastroParceiros: function(){
                this.getRouter().navTo("CadastroParceiros");
            }
		});
	});
