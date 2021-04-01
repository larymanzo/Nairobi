sap.ui.define([
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox"
    ],
    
	function (BaseController, JSONModel, MessageBox) {
		"use strict";

		return BaseController.extend("treinamento.l4e.app.controller.CadastroParceiros", {
			onInit: function () {
                // Rota de cadastro
                this.getRouter().getRoute("CadastroParceiros").attachPatternMatched(this.handleRouteMatched, this);
                // Rota de edição
                this.getRouter().getRoute("EditarParceiros").attachPatternMatched(this.handleRouteMatchedEditarParceiro, this);
            },
            
            // Rota de cadastro
            handleRouteMatched: function(){
                // Inicia o model com o status "A" (ativo)
                this.getView().setModel(new JSONModel({
                    "status": "A" 
                }), "Parceiro");
            },

            // Rota de edição
            handleRouteMatchedEditarParceiro: async function(){
                var that = this;
                var id = this.getRouter().getHashChanger().getHash().split("/")[1];
                this.getView().setBusy(true);
                // Faz a chamada na API para pegar o parceiro selecionado na tabela.
                // Precisamos passar o ID na url para a API retornar apenas os dados do item selecionado.
                await 
                $.ajax({
                    "url": `/api/parceiros/${id}`, // concatena a URL com o ID
                    "method": "GET",
                    success(data) {
                        that.getView().setModel(new JSONModel(data), "Parceiro"); // salva o retorno da API (data) em um Model chamado 'Parceiro'
                    },
                    error() {
                        MessageBox.error("Não foi possível buscar os Parceiros.") //Se der erro de API, exibe uma mensagem ao usuário
                    }
                });
                this.getView().setBusy(false);
            },

            // Função do elemento 'Switch' da tela
            onChangeSwitch: function(oEvent){
                // Salva o status no Model 'Parceiro' de acordo com a propriedade state.
                // Se o state for true -> salva como 'A' (que significa ativo)
                // Se o state for false -> salva como 'I' (que significa inativo)
                this.getView().getModel("Parceiro").setProperty("/status", oEvent.getSource().getState() === true ? "A" : "I" );
            },

            // Função do botão "Confirmar"
            onConfirmar: async function(){
                var oParceiro = this.getView().getModel("Parceiro").getData();
                var that = this;
                console.log(oParceiro)

                // Primeiro é validado se a rota que estamos é a rota de 'EditarParceiros'
                // Se for, o botão será responsável por atualizar (PUT) os dados
                // Senão, irá criar (POST) um novo registro na tabela
                if(this.getRouter().getHashChanger().getHash().search("EditarParceiros") === 0){

                    await $.ajax(`/api/parceiros/${oParceiro.id}`, { // Concatena o ID do parceiro selecionado na url
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // Cria a estrutura dos dados para enviar para API
                    data: JSON.stringify({
                        "nome": oParceiro.nome,
                        "tipo": oParceiro.tipo,
                        "status": oParceiro.status
                    }),
                    success() {
                        // Se a api retornar sucesso, exibe uma mensagem para o usuário e navega para a tela de "ConsultaParceiros"
                        MessageBox.success("Editado com sucesso!", {
                            onClose: function() {
                                that.getRouter().navTo("ConsultaParceiros");
                            }
                        });
                    },
                    error() {
                        //Se a api retornar erro, exibe uma mensagem ao usuário
                        MessageBox.error("Não foi possível editar o parceiro.");
                    }
                });

                }else{

                    this.getView().setBusy(true);
                    // Método POST para salvar os dados 
                    await $.ajax("/api/parceiros", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(oParceiro),
                        success(){
                            MessageBox.success("Salvo com sucesso!");
                        },
                        error(){
                            MessageBox.error("Não foi possível salvar o parceiro.");
                        }
                    })

                    this.getView().setBusy(false);

                }
            },

            // Função do botão Cancelar
            onCancelar: function(){
                // Se a rota for a de "EditarParceiros", navega para a tela de Consuta
                // Senão, limpa o model 'Parceiro'
                if(this.getRouter().getHashChanger().getHash().search("EditarParceiros") === 0){
                    this.getRouter().navTo("ConsultaParceiros");
                }else{
                    this.getView().setModel(new JSONModel({"status": "A"}), "Parceiro")
                }
            }
		});
	});
