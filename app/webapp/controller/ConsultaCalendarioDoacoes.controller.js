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

		return BaseController.extend("treinamento.l4e.app.controller.ConsultaCalendarioDoacoes", {
			onInit: function () {
                this.getRouter().getRoute("ConsultaCalendarioDoacoes").attachPatternMatched(this.handleRouteMatched, this);

            },
            
            handleRouteMatched: async function(){
                console.log('entrou')
                var that = this;
                // Busca todos as Doacoes cadastrados (GET)
                await
                $.ajax({
                    "url": "/apiNairobi/AgendaDoacoesSet",
                    "method": "GET",
                    success(data){
                        console.log(data.value)
                        that.getView().setModel(new JSONModel(data.value), "AgendaDoacoes")
                    },
                    error(){
                        MessageBox.error("Não foi possível buscar calendários.")
                    }

                })
            },
            
            // Função do botão 'Excluir'
            onExcluir: async function(oEvent){
                var id = oEvent.getParameter('listItem').getBindingContext("AgendaDoacoes").getObject().ID; // pega o ID do Doacoe selecionado
                this.getView().setBusy(true);

                // Método DELETE para deletar um registro 
                await
                $.ajax({
                    "url": `/apiNairobi/AgendaDoacoesSet/${id}`,
                    "method": "DELETE",
                    success(data){
                        MessageBox.success("Excluído com sucesso!")
                    },
                    error(){
                        MessageBox.error("Não foi possível excluir a Doação.")
                    }

                });
                await this.handleRouteMatched(); // chama a função para recarregar os dados da tabela
                this.getView().setBusy(false);

            },

            // Função do botão editar da tabela
            onNavEditarAgendaDoacoes: function(oEvent){
                var agendaDoacoesId = oEvent.getSource().getBindingContext("AgendaDoacoes").getObject().ID; // pega o id do Doacoe selecionado
                this.getRouter().navTo("EditarCalendarioDoacoes", {id: agendaDoacoesId}); // chama a rota de edição passando o id do Doacoe selecionado
            },

            // Função do campo de busca (SearchField)
            onSearch: function(oEvent){
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("nome", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }

                var oList = this.byId("tableAgendaDoacoes");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            }
		});
	});
