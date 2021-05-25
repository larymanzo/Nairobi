sap.ui.define([
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox"
    ],
    
	function (BaseController, JSONModel, MessageBox) {
		"use strict";

		return BaseController.extend("treinamento.l4e.app.controller.CadastroDoacoes", {
			onInit: function () {
                // Rota de cadastro
                this.getRouter().getRoute("CadastroDoacoes").attachPatternMatched(this.handleRouteMatched, this);
                // Rota de edição
                // this.getRouter().getRoute("EditarDoacoes").attachPatternMatched(this.handleRouteMatchedEditarDoacoes, this);
            },
            
            // Rota de cadastro
            handleRouteMatched: function(){
                // Inicia o model com o status "A" (ativo)
                this.getView().setModel(new JSONModel({
                    "status": "A" 
                }), "Doacoes");

                this.getView().setModel(new JSONModel({
                    "text": "Sem voluntário"
                }), "Doacoe");    
                console.log('cadastro')
                console.log(this.getView().getModel('Doacoe').getData())  
            },

            // Rota de edição
            handleRouteMatchedEditarDoacoe: async function(){
                var that = this;
                var id = this.getRouter().getHashChanger().getHash().split("/")[1];
                this.getView().setBusy(true);
                // Faz a chamada na API para pegar a doação selecionado na tabela.
                // Precisamos passar o ID na url para a API retornar apenas os dados do item selecionado.
                await 
                $.ajax({
                    "url": `/api/doacoes/${id}`, // concatena a URL com o ID
                    "method": "GET",
                    success(data) {
                        that.getView().setModel(new JSONModel(data), "Doacoe"); // salva o retorno da API (data) em um Model chamado 'Doacoe'
                    },
                    error() {
                        MessageBox.error("Não foi possível buscar os Doacoes.") //Se der erro de API, exibe uma mensagem ao usuário
                    }
                });

                           
                
                this.getView().setBusy(false);
            },

            // Função do elemento 'Switch' da tela
            onChangeSwitch: function(oEvent){
                // Salva o status no Model 'Doacoe' de acordo com a propriedade state.
                // Se o state for true -> salva como 'A' (que significa ativo)
                // Se o state for false -> salva como 'I' (que significa inativo)
                this.getView().getModel("Doacoe").setProperty("/status", oEvent.getSource().getState() === true ? "A" : "I" );
            },

            // Função do botão "Confirmar"
            onConfirmar: async function(){
                var oDoacoe = this.getView().getModel("Doacoe").getData();
                var that = this;
                console.log(oDoacoe)

                // Primeiro é validado se a rota que estamos é a rota de 'EditarDoacoes'
                // Se for, o botão será responsável por atualizar (PUT) os dados
                // Senão, irá criar (POST) um novo registro na tabela
                if(this.getRouter().getHashChanger().getHash().search("EditarDoacoes") === 0){

                    await $.ajax(`/api/doacoes/${oDoacoe.id}`, { // Concatena o ID do Doacoe selecionado na url
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // Cria a estrutura dos dados para enviar para API
                    data: JSON.stringify({
                        "nome": oDoacoe.nome,
                        "tipo": oDoacoe.tipo,
                        "status": oDoacoe.status
                    }),
                    success() {
                        // Se a api retornar sucesso, exibe uma mensagem para o usuário e navega para a tela de "ConsultaDoacoes"
                        MessageBox.success("Editado com sucesso!", {
                            onClose: function() {
                                that.getRouter().navTo("ConsultaDoacoes");
                            }
                        });
                    },
                    error() {
                        //Se a api retornar erro, exibe uma mensagem ao usuário
                        MessageBox.error("Não foi possível editar as doações.");
                    }
                });

                }else{

                    this.getView().setBusy(true);
                    // Método POST para salvar os dados 
                    await $.ajax("/api/doacoes", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(oDoacoe),
                        success(){
                            MessageBox.success("Salvo com sucesso!");
                        },
                        error(){
                            MessageBox.error("Não foi possível salvar a doação.");
                        }
                    })

                    this.getView().setBusy(false);

                }
            },

            // Função do botão Cancelar
            onCancelar: function(){
                // Se a rota for a de "EditarDoacoes", navega para a tela de Consuta
                // Senão, limpa o model 'Doacoe'
                if(this.getRouter().getHashChanger().getHash().search("EditarDoacoes") === 0){
                    this.getRouter().navTo("ConsultaDoacoes");
                }else{
                    this.getView().setModel(new JSONModel({"status": "A"}), "Doacoe")
                }
            }
		});
	});
