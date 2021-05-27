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
                // Busca todas as funções
                var funcoes
                await
                $.ajax({
                    "url": "/apiNairobi/FuncoesSet",
                    "method": "GET",
                    success(data){
                        funcoes = data.value
                    },
                    error(){
                        MessageBox.error("Não foi possível buscar os Voluntarios.")
                    }
                })

                // Busca todos os Voluntarios cadastrados (GET)
                var voluntarios
                await
                $.ajax({
                    "url": "/apiNairobi/VoluntariosSet",
                    "method": "GET",
                    success(data){
                        voluntarios = data.value
                        for (let index in voluntarios) {
                            for (let index2 in funcoes) {
                                if (voluntarios[index].tipo_ID == funcoes[index2].ID) {
                                    voluntarios[index].funcao = funcoes[index2].descricao
                                }
                            }
                        }
                        that.getView().setModel(new JSONModel(voluntarios), "Voluntarios")
                    },
                    error(){
                        MessageBox.error("Não foi possível buscar os Voluntarios.")
                    }
                })

            },
            
            // Função do botão 'Excluir'
            onExcluir: async function(oEvent){
                var id = oEvent.getParameter('listItem').getBindingContext("Voluntarios").getObject().ID; // pega o ID do Voluntario selecionado
                console.log(id)
                this.getView().setBusy(true);

                // Método DELETE para deletar um registro 
                await
                $.ajax({
                    "url": `/apiNairobi/VoluntariosSet/${id}`,
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
                var voluntarioId = oEvent.getSource().getBindingContext("Voluntarios").getObject().ID; // pega o id do voluntario selecionado
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
