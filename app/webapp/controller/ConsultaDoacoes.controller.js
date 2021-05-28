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

		return BaseController.extend("treinamento.l4e.app.controller.ConsultaDoacoes", {
			onInit: function () {
                this.getRouter().getRoute("ConsultaDoacoes").attachPatternMatched(this.handleRouteMatched, this);
            },
            
            handleRouteMatched: async function(){
                
                var that = this;
                // Busca todas os voluntários
                var voluntarios
                await
                $.ajax({
                    "url": "/apiNairobi/VoluntariosSet",
                    "method": "GET",
                    success(data){
                        voluntarios = data.value
                        that.getView().setModel(new JSONModel(voluntarios), "Voluntarios")
                    },
                    error(){
                        MessageBox.error("Não foi possível buscar os Voluntarios.")
                    }
                })  

                // Busca todos as Doacao cadastrados (GET)
                var doacao
                await
                $.ajax({
                    "url": "/apiNairobi/DoacoesSet",
                    "method": "GET",
                    success(data){
                        doacao = data.value
                        for (let index in doacao) {
                            for (let index2 in voluntarios) {
                                if (doacao[index].voluntario_ID == voluntarios[index2].ID) {
                                    doacao[index].voluntario = voluntarios[index2].nome
                                }
                            }
                        }
                        console.log(doacao)
                        that.getView().setModel(new JSONModel(doacao), "Doacoes")
                    },
                    error(){
                        MessageBox.error("Não foi possível buscar as Doações.")
                    }
                })

            },
            
            // Função do botão 'Excluir'
            onExcluir: async function(oEvent){
                var id = oEvent.getParameter('listItem').getBindingContext("Doacoes").getObject().ID; // pega o ID selecionado
                this.getView().setBusy(true);

                // Método DELETE para deletar um registro 
                await
                $.ajax({
                    "url": `/apiNairobi/DoacoesSet/${id}`,
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
            onNavEditarDoacoe: function(oEvent){
                var doacaoId = oEvent.getSource().getBindingContext("Doacoes").getObject().ID; // pega o id da doação selecionado
                this.getRouter().navTo("EditarDoacoes", {id: doacaoId}); // chama a rota de edição passando o id do Voluntario selecionado
            },

            // Função do campo de busca (SearchField)
            onSearch: function(oEvent){
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("nome", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }

                var oList = this.byId("tableDoacoes");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            }
		});
	});
