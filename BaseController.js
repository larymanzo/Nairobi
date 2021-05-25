sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		return Controller.extend("treinamento.l4e.app.controller.BaseController", {
            
            getRouter : function () {
			    return this.getOwnerComponent().getRouter();
            },

            getModel : function (sName) {
                return this.getView().getModel(sName);
            },

            setModel : function (oModel, sName) {
                return this.getView().setModel(oModel, sName);
            }
		});
	});
