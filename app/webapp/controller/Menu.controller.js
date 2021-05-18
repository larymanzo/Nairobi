sap.ui.define([
        "./BaseController",
        'sap/ui/core/Fragment'
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, Fragment) {
        "use strict";
        let oView;

		return BaseController.extend("treinamento.l4e.app.controller.Menu", {
			onInit: function () {
                oView = this.getView()
            },

            // botão localidades ao abrir
            onPressLocalidades: function () {
                var oButton = oView.byId("buttonLocalidades");
                this._oMenuFragment = Fragment.load({
                    id: oView.getId(),
                    name: "treinamento.l4e.app.view.fragments.Localidades",
                    controller: this
                }).then(function(oMenu) {
                    oMenu.openBy(oButton);
                    this._oMenuFragment = oMenu;
                    return this._oMenuFragment;
                }.bind(this));
			},
            
            // botão Voluntários ao abrir
            onPressVoluntarios: function () {
                var oButton = oView.byId("buttonVoluntarios");
                this._oMenuFragment = Fragment.load({
                    id: oView.getId(),
                    name: "treinamento.l4e.app.view.fragments.Voluntarios",
                    controller: this
                }).then(function(oMenu) {
                    oMenu.openBy(oButton);
                    this._oMenuFragment = oMenu;
                    return this._oMenuFragment;
                }.bind(this));
            },
            
            // botão Doações ao abrir
            onPressDoacoes: function () {
                var oButton = oView.byId("buttonDoacoes");
                this._oMenuFragment = Fragment.load({
                    id: oView.getId(),
                    name: "treinamento.l4e.app.view.fragments.Doacoes",
                    controller: this
                }).then(function(oMenu) {
                    oMenu.openBy(oButton);
                    this._oMenuFragment = oMenu;
                    return this._oMenuFragment;
                }.bind(this));
            },

            onPressCadastroVoluntario: function(){
                this.getRouter().navTo("CadastroVoluntarios");
            },

            onPressConsultaVoluntario: function(){
                this.getRouter().navTo("ConsultaVoluntarios")
            }
            
            // // Função do botão de "Consulta de Plataformas"
            // onNavConsultaPlataformas: function(){
            //     this.getRouter().navTo("ConsultaPlataformas");
            // },
            
            // // Função do botão de "Cadastro de Plataformas"
            // onNavCadastroPlataformas: function(){
            //     this.getRouter().navTo("CadastroPlataformas");
            // }
		});
	});