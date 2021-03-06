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

		return BaseController.extend("treinamento.l4e.app.controller.ConsultaLocalidade", {
			onInit: function () {
                this.getRouter().getRoute("ConsultaLocalidade").attachPatternMatched(this.handleRouteMatched, this);
            },
            
            handleRouteMatched: async function(){
                
                var that = this;
                // Busca todos as Localidades cadastrados (GET)
                var localidade
                await
                $.ajax({
                    "url": "/apiNairobi/LocalidadesSet",
                    "method": "GET",
                    success(data){
                        localidade = data.value
                        that.getView().setModel(new JSONModel(localidade), "Localidade")
                    },
                    error(){
                        MessageBox.error("Não foi possível buscar as Localidades.")
                    }
                })

            },
            
            // Função do botão 'Excluir'
            onExcluir: async function(oEvent){
                var id = oEvent.getParameter('listItem').getBindingContext("Localidade").getObject().ID; // pega o ID do Voluntario selecionado
                this.getView().setBusy(true);

                // Método DELETE para deletar um registro 
                await
                $.ajax({
                    "url": `/apiNairobi/LocalidadesSet/${id}`,
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
                var localidadeId = oEvent.getSource().getBindingContext("Localidade").getObject().ID; // pega o id do voluntario selecionado
                this.getRouter().navTo("EditarLocalidade", {id: localidadeId}); // chama a rota de edição passando o id do Voluntario selecionado
            },

            // Função do campo de busca (SearchField)
            onSearch: function(oEvent){
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("nome", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }

                var oList = this.byId("tableLocalidade");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            }
		});
	});
