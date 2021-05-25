sap.ui.define([
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox"
    ],
    
	function (BaseController, JSONModel, MessageBox) {
        "use strict";

		return BaseController.extend("treinamento.l4e.app.controller.Inicio", {
            onInit: function () {
                //criando e formatando data atual

                let dataHoje = new Date();
                let ano = dataHoje.getFullYear();
                let dia = dataHoje.getDate();
                let mes = dataHoje.getMonth()+1;
                let dataFormatada = `${dia}/${mes}/${ano}` 
                console.log(dataFormatada);
                
                //criando Model para data atual

                this.getView().setModel(new JSONModel({
                    data: dataFormatada
                }),'dataAtual');

                //pegando a Api

                
            },

				onSliderMoved: function (oEvent) {
			var fValue = oEvent.getParameter("value");
			this.byId("gridLayout").setWidth(fValue + "%");
        }
    });
});