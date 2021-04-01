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

		return BaseController.extend("treinamento.l4e.app.controller.ConsultaParceiros", {
			onInit: function () {
                this.getRouter().getRoute("ConsultaParceiros").attachPatternMatched(this.handleRouteMatched, this);

            },
            
            handleRouteMatched: async function(){
                var that = this;
                // Busca todos os Parceiros cadastrados (GET)
                await
                $.ajax({
                    "url": "/api/parceiros",
                    "method": "GET",
                    success(data){
                        that.getView().setModel(new JSONModel(data), "Parceiros")
                    },
                    error(){
                        MessageBox.error("Não foi possível buscar os Parceiros.")
                    }

                })
            },
            
            // Função do botão 'Excluir'
            onExcluir: async function(oEvent){
                var id = oEvent.getParameter('listItem').getBindingContext("Parceiros").getObject().id; // pega o ID do parceiro selecionado
                this.getView().setBusy(true);

                // Método DELETE para deletar um registro 
                await
                $.ajax({
                    "url": `/api/parceiros/${id}`,
                    "method": "DELETE",
                    success(data){
                        MessageBox.success("Excluído com sucesso!")
                    },
                    error(){
                        MessageBox.error("Não foi possível excluir o Parceiro.")
                    }

                });
                await this.handleRouteMatched(); // chama a função para recarregar os dados da tabela
                this.getView().setBusy(false);

            },

            // Função do botão editar da tabela
            onNavEditarParceiro: function(oEvent){
                var parceiroId = oEvent.getSource().getBindingContext("Parceiros").getObject().id; // pega o id do parceiro selecionado
                this.getRouter().navTo("EditarParceiros", {id: parceiroId}); // chama a rota de edição passando o id do parceiro selecionado
            },

            // Função do campo de busca (SearchField)
            onSearch: function(oEvent){
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("nome", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }

                var oList = this.byId("tableParceiros");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            }
		});
	});
