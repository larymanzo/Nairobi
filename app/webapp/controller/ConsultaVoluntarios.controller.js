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

		return BaseController.extend("treinamento.l4e.app.controller.ConsultaVoluntarios", {
			onInit: function () {
                this.getRouter().getRoute("ConsultaVoluntarios").attachPatternMatched(this.handleRouteMatched, this);

            },
            
            handleRouteMatched: async function(){
                var that = this;
                // Busca todos os Voluntarios cadastrados (GET)
                await
                $.ajax({
                    "url": "/api/voluntarios",
                    "method": "GET",
                    success(data){
                        that.getView().setModel(new JSONModel(data), "Voluntarios")
                    },
                    error(){
                        MessageBox.error("Não foi possível buscar os Voluntarios.")
                    }

                })
            },
            
            // Função do botão 'Excluir'
            onExcluir: async function(oEvent){
                var id = oEvent.getParameter('listItem').getBindingContext("Voluntarios").getObject().id; // pega o ID do Voluntario selecionado
                this.getView().setBusy(true);

                // Método DELETE para deletar um registro 
                await
                $.ajax({
                    "url": `/api/voluntarios/${id}`,
                    "method": "DELETE",
                    success(data){
                        MessageBox.success("Excluído com sucesso!")
                    },
                    error(){
                        MessageBox.error("Não foi possível excluir o Voluntario.")
                    }

                });
                await this.handleRouteMatched(); // chama a função para recarregar os dados da tabela
                this.getView().setBusy(false);

            },

            // Função do botão editar da tabela
            onNavEditarVoluntario: function(oEvent){
                var voluntarioId = oEvent.getSource().getBindingContext("Voluntarios").getObject().id; // pega o id do voluntario selecionado
                this.getRouter().navTo("EditarVoluntarios", {id: voluntarioId}); // chama a rota de edição passando o id do Voluntario selecionado
            },

            // Função do campo de busca (SearchField)
            onSearch: function(oEvent){
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("nome", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }

                var oList = this.byId("tableVoluntarios");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            }
		});
	});
