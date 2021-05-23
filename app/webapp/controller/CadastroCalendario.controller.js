sap.ui.define([
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox"
    ],
    
	function (BaseController, JSONModel, MessageBox) {
		"use strict";

		return BaseController.extend("treinamento.l4e.app.controller.CadastroCalendario", {
			onInit: function () {
                // Rota de cadastro
                this.getRouter().getRoute("CadastroCalendario").attachPatternMatched(this.handleRouteMatched, this);
                // Rota de edição
                // this.getRouter().getRoute("EditarDoacoes").attachPatternMatched(this.handleRouteMatchedEditarDoacoes, this);
            },
            
            // Rota de cadastro
            handleRouteMatched: function(){
                // Inicia o model com o status "A" (ativo)
                this.getView().setModel(new JSONModel({
                    "status": "A" 
                }), "Calendario");

                this.getView().setModel(new JSONModel({
                    "text": "Sem voluntário"
                }), "Calendario");    
                console.log('cadastro')
                console.log(this.getView().getModel('Calendario').getData())  
            },

            // Rota de edição
            handleRouteMatchedEditarCalendario: async function(){
                var that = this;
                var id = this.getRouter().getHashChanger().getHash().split("/")[1];
                this.getView().setBusy(true);
                // Faz a chamada na API para pegar a doação selecionado na tabela.
                // Precisamos passar o ID na url para a API retornar apenas os dados do item selecionado.
                await 
                $.ajax({
                    "url": `/api/calendario/${id}`, // concatena a URL com o ID
                    "method": "GET",
                    success(data) {
                        that.getView().setModel(new JSONModel(data), "Calendario"); // salva o retorno da API (data) em um Model chamado 'Doacoe'
                    },
                    error() {
                        MessageBox.error("Não foi possível buscar os Calendarios.") //Se der erro de API, exibe uma mensagem ao usuário
                    }
                });

                           
                
                this.getView().setBusy(false);
            },

            // Função do elemento 'Switch' da tela
            onChangeSwitch: function(oEvent){
                // Salva o status no Model 'Doacoe' de acordo com a propriedade state.
                // Se o state for true -> salva como 'A' (que significa ativo)
                // Se o state for false -> salva como 'I' (que significa inativo)
                this.getView().getModel("Calendario").setProperty("/status", oEvent.getSource().getState() === true ? "A" : "I" );
            },

            // Função do botão "Confirmar"
            onConfirmar: async function(){
                var oCalendario = this.getView().getModel("Calendario").getData();
                var that = this;
                console.log(oCalendario)

                // Primeiro é validado se a rota que estamos é a rota de 'EditarDoacoes'
                // Se for, o botão será responsável por atualizar (PUT) os dados
                // Senão, irá criar (POST) um novo registro na tabela
                if(this.getRouter().getHashChanger().getHash().search("EditarCalendario") === 0){

                    await $.ajax(`/api/calendario/${oCalendario.id}`, { // Concatena o ID do Doacoe selecionado na url
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // Cria a estrutura dos dados para enviar para API
                    data: JSON.stringify({
                        "nome": oCalendario.nome,
                        "tipo": oCalendario.tipo,
                        "status": oCalendario.status
                    }),
                    success() {
                        // Se a api retornar sucesso, exibe uma mensagem para o usuário e navega para a tela de "ConsultaDoacoes"
                        MessageBox.success("Editado com sucesso!", {
                            onClose: function() {
                                that.getRouter().navTo("ConsultaCalendario");
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
                    await $.ajax("/api/calendario", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(oCalendario),
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
                if(this.getRouter().getHashChanger().getHash().search("EditarCalendario") === 0){
                    this.getRouter().navTo("ConsultaCalendario");
                }else{
                    this.getView().setModel(new JSONModel({"status": "A"}), "Calendario")
                }
            }
		});
	});
