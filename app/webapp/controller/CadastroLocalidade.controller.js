sap.ui.define([
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox"
    ],
    
	function (BaseController, JSONModel, MessageBox) {
		"use strict";

		return BaseController.extend("treinamento.l4e.app.controller.CadastroLocalidade", {
			onInit: function () {
                // Rota de cadastro
                this.getRouter().getRoute("CadastroLocalidade").attachPatternMatched(this.handleRouteMatched, this);
                // Rota de edição
                // this.getRouter().getRoute("EditarLocalidade").attachPatternMatched(this.handleRouteMatchedEditarLocalidade, this);
            },
            
            // Rota de cadastro
            handleRouteMatched: function(){
                // Inicia o model com o status "A" (ativo)
                this.getView().setModel(new JSONModel({
                    "status": "A" 
                }), "Localidades");

                this.getView().setModel(new JSONModel({
                    "text": "Sem voluntário"
                }), "Localidades");    
                console.log('cadastro')
                console.log(this.getView().getModel('Localidade').getData())  
            },

            // Rota de edição
            handleRouteMatchedEditarLocalidade: async function(){
                var that = this;
                var id = this.getRouter().getHashChanger().getHash().split("/")[1];
                this.getView().setBusy(true);
                // Faz a chamada na API para pegar a doação selecionado na tabela.
                // Precisamos passar o ID na url para a API retornar apenas os dados do item selecionado.
                await 
                $.ajax({
                    "url": `/api/localidades/${id}`, // concatena a URL com o ID
                    "method": "GET",
                    success(data) {
                        that.getView().setModel(new JSONModel(data), "Localidade"); // salva o retorno da API (data) em um Model chamado 'Localidade'
                    },
                    error() {
                        MessageBox.error("Não foi possível buscar as Localidade.") //Se der erro de API, exibe uma mensagem ao usuário
                    }
                });

                           
                
                this.getView().setBusy(false);
            },

            // Função do elemento 'Switch' da tela
            onChangeSwitch: function(oEvent){
                // Salva o status no Model 'Localidade' de acordo com a propriedade state.
                // Se o state for true -> salva como 'A' (que significa ativo)
                // Se o state for false -> salva como 'I' (que significa inativo)
                this.getView().getModel("Localidade").setProperty("/status", oEvent.getSource().getState() === true ? "A" : "I" );
            },

            // Função do botão "Confirmar"
            onConfirmar: async function(){
                var oLocalidade = this.getView().getModel("Localidade").getData();
                var that = this;
                console.log(oLocalidade)

                // Primeiro é validado se a rota que estamos é a rota de 'EditarLocalidade'
                // Se for, o botão será responsável por atualizar (PUT) os dados
                // Senão, irá criar (POST) um novo registro na tabela
                if(this.getRouter().getHashChanger().getHash().search("EditarLocalidade") === 0){

                    await $.ajax(`/api/localidade/${oLocalidade.id}`, { // Concatena o ID do Localidade selecionado na url
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // Cria a estrutura dos dados para enviar para API
                    data: JSON.stringify({
                        "nome": oLocalidade.nome,
                        "tipo": oLocalidade.tipo,
                        "status": oLocalidade.status
                    }),
                    success() {
                        // Se a api retornar sucesso, exibe uma mensagem para o usuário e navega para a tela de "ConsultaLocalidade"
                        MessageBox.success("Editado com sucesso!", {
                            onClose: function() {
                                that.getRouter().navTo("ConsultaLocalidade");
                            }
                        });
                    },
                    error() {
                        //Se a api retornar erro, exibe uma mensagem ao usuário
                        MessageBox.error("Não foi possível editar as localidades.");
                    }
                });

                }else{

                    this.getView().setBusy(true);
                    // Método POST para salvar os dados 
                    await $.ajax("/api/localidades", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(oLocalidade),
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
                // Se a rota for a de "EditarLocalidade", navega para a tela de Consuta
                // Senão, limpa o model 'Localidade'
                if(this.getRouter().getHashChanger().getHash().search("EditarLocalidade") === 0){
                    this.getRouter().navTo("ConsultaLocalidade");
                }else{
                    this.getView().setModel(new JSONModel({"status": "A"}), "Localidade")
                }
            }
		});
	});
