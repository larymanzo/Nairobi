sap.ui.define([
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox"
    ],
    
	function (BaseController, JSONModel, MessageBox) {
		"use strict";

		return BaseController.extend("treinamento.l4e.app.controller.CadastroVoluntarios", {
			onInit: function () {
                // Rota de cadastro
                this.getRouter().getRoute("CadastroVoluntarios").attachPatternMatched(this.handleRouteMatched, this);
                // Rota de edição
                this.getRouter().getRoute("EditarVoluntarios").attachPatternMatched(this.handleRouteMatchedEditarVoluntario, this);
            },
            
            // Rota de cadastro
            handleRouteMatched: function(){
                // Inicia o model com o status "A" (ativo)
                this.getView().setModel(new JSONModel({
                    "status": "A" 
                }), "Voluntario");
            },

            // Rota de edição
            handleRouteMatchedEditarVoluntario: async function(){
                var that = this;
                var id = this.getRouter().getHashChanger().getHash().split("/")[1];
                this.getView().setBusy(true);
                // Faz a chamada na API para pegar o voluntario selecionado na tabela.
                // Precisamos passar o ID na url para a API retornar apenas os dados do item selecionado.
                await 
                $.ajax({
                    "url": `/api/voluntarios/${id}`, // concatena a URL com o ID
                    "method": "GET",
                    success(data) {
                        that.getView().setModel(new JSONModel(data), "Voluntario"); // salva o retorno da API (data) em um Model chamado 'Voluntario'
                    },
                    error() {
                        MessageBox.error("Não foi possível buscar os Voluntarios.") //Se der erro de API, exibe uma mensagem ao usuário
                    }
                });
                this.getView().setBusy(false);
            },

            // Função do elemento 'Switch' da tela
            onChangeSwitch: function(oEvent){
                // Salva o status no Model 'Voluntario' de acordo com a propriedade state.
                // Se o state for true -> salva como 'A' (que significa ativo)
                // Se o state for false -> salva como 'I' (que significa inativo)
                this.getView().getModel("Voluntario").setProperty("/status", oEvent.getSource().getState() === true ? "A" : "I" );
            },

            // Função do botão "Confirmar"
            onConfirmar: async function(){
                var oVoluntario = this.getView().getModel("Voluntario").getData();
                var that = this;
                console.log(oVoluntarios)

                // Primeiro é validado se a rota que estamos é a rota de 'EditarVoluntarios'
                // Se for, o botão será responsável por atualizar (PUT) os dados
                // Senão, irá criar (POST) um novo registro na tabela
                if(this.getRouter().getHashChanger().getHash().search("EditarVoluntarios") === 0){

                    await $.ajax(`/api/voluntarios/${oVoluntario.id}`, { // Concatena o ID do Voluntario selecionado na url
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // Cria a estrutura dos dados para enviar para API
                    data: JSON.stringify({
                        "nome": oVoluntario.nome,
                        "tipo": oVoluntario.tipo,
                        "status": oVoluntario.status
                    }),
                    success() {
                        // Se a api retornar sucesso, exibe uma mensagem para o usuário e navega para a tela de "ConsultaVoluntarios"
                        MessageBox.success("Editado com sucesso!", {
                            onClose: function() {
                                that.getRouter().navTo("ConsultaVoluntarios");
                            }
                        });
                    },
                    error() {
                        //Se a api retornar erro, exibe uma mensagem ao usuário
                        MessageBox.error("Não foi possível editar o Voluntario.");
                    }
                });

                }else{

                    this.getView().setBusy(true);
                    // Método POST para salvar os dados 
                    await $.ajax("/api/voluntarios", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(oVoluntario),
                        success(){
                            MessageBox.success("Salvo com sucesso!");
                        },
                        error(){
                            MessageBox.error("Não foi possível salvar o Voluntario.");
                        }
                    })

                    this.getView().setBusy(false);

                }
            },

            // Função do botão Cancelar
            onCancelar: function(){
                // Se a rota for a de "EditarVoluntarios", navega para a tela de Consuta
                // Senão, limpa o model 'Voluntario'
                if(this.getRouter().getHashChanger().getHash().search("EditarVoluntarios") === 0){
                    this.getRouter().navTo("ConsultaVoluntarios");
                }else{
                    this.getView().setModel(new JSONModel({"status": "A"}), "Voluntario")
                }
            }
		});
	});
