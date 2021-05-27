sap.ui.define([
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel, MessageBox, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("treinamento.l4e.app.controller.ConsultaLocalidades", {
			onInit: function () {
                this.getRouter().getRoute("ConsultaLocalidades").attachPatternMatched(this.handleRouteMatched, this);

            },
            
            handleRouteMatched: async function(){
                var that = this;
                // Busca todos as Localidade cadastrados (GET)
                await
                $.ajax({
                    "url": "/apiNairobi/api/ocalidadesSet",
                    "method": "GET",
                    success(data){
                        that.getView().setModel(new JSONModel(data.value), "Localidades")
                    },
                    error(){
                        MessageBox.error("Não foi possível buscar as Localidades.")
                    }

                })
            },
            
            // Função do botão 'Excluir'
            onExcluir: async function(oEvent){
                var id = oEvent.getParameter('listItem').getBindingContext("Localidades").getObject().id; // pega o ID do Doacoe selecionado
                this.getView().setBusy(true);

                // Método DELETE para deletar um registro 
                await
                $.ajax({
                    "url": `/apiNairobi/api/LocalidadesSet/${id}`,
                    "method": "DELETE",
                    success(data){
                        MessageBox.success("Excluído com sucesso!")
                    },
                    error(){
                        MessageBox.error("Não foi possível excluir a Localidade.")
                    }

                });
                await this.handleRouteMatched(); // chama a função para recarregar os dados da tabela
                this.getView().setBusy(false);

            },

            // Função do botão editar da tabela
            onNavEditarLocalidade: function(oEvent){
                var localidadesId = oEvent.getSource().getBindingContext("Localidades").getObject().id; // pega o id do Localidade selecionado
                this.getRouter().navTo("EditarLocalidade", {id: localidadesId}); // chama a rota de edição passando o id do Localidade selecionado
            },

            // Função do campo de busca (SearchField)
            onSearch: function(oEvent){
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("nome", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }

                var oList = this.byId("tableLocalidades");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            }
		});
	});
