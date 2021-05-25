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
            
            // botão Calendario ao abrir
            onPressCalendario: function () {
                var oButton = oView.byId("buttonCalendario");
                this._oMenuFragment = Fragment.load({
                    id: oView.getId(),
                    name: "treinamento.l4e.app.view.fragments.Calendario",
                    controller: this
                }).then(function(oMenu) {
                    oMenu.openBy(oButton);
                    this._oMenuFragment = oMenu;
                    return this._oMenuFragment;
                }.bind(this));
            },

            onPressInicio: function(){
                this.getRouter().navTo("Inicio");
            },

            onPressCadastroVoluntario: function(){
                this.getRouter().navTo("CadastroVoluntarios");
            },

            onPressConsultaVoluntario: function(){
                this.getRouter().navTo("ConsultaVoluntarios")
            },

            onPressCadastroDoacoes: function(){
                this.getRouter().navTo("CadastroDoacoes");
            },

            onPressConsultaDoacoes: function(){
                this.getRouter().navTo("ConsultaDoacoes")
            },

            onPressCadastroLocalidade: function(){
                this.getRouter().navTo("CadastroLocalidade");
            },

            onPressConsultaLocalidade: function(){
                this.getRouter().navTo("ConsultaLocalidade")
            },

            onPressCadastroCalendario: function(){
                this.getRouter().navTo("CadastroCalendario");
            },

            onPressConsultaCalendario: function(){
                this.getRouter().navTo("ConsultaCalendario")
            }
		});
	});