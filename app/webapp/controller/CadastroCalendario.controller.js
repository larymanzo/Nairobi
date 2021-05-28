sap.ui.define([
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox"
    ],
    
	function (BaseController, JSONModel, MessageBox) {
		"use strict";

		return BaseController.extend("treinamento.l4e.app.controller.CadastroCalendario", {
			onInit: function () {
                // Rota de cadastro de doações
                this.getRouter().getRoute("CadastroCalendarioDoacoes").attachPatternMatched(this.handleRouteMatchedDoacoes, this);

                // Rota de cadastro de entregas
                this.getRouter().getRoute("CadastroCalendarioEntregas").attachPatternMatched(this.handleRouteMatchedEntregas, this);

                // Rota de editar de calendário de doações
                this.getRouter().getRoute("EditarCalendarioDoacoes").attachPatternMatched(this.handleRouteMatchedEditarDoacoes, this);

                // Rota de editar de calendário de entregas
                this.getRouter().getRoute("EditarCalendarioEntregas").attachPatternMatched(this.handleRouteMatchedEditarEntregas, this);
            },

            // rota para gerar novo ID
            geraNovoID: async function(url) {
                var maiorID = 0;
                console.log(url)
                await 
                $.ajax({
                    "url": `/apiNairobi/${url}`, 
                    "method": "GET",
                    success(data) {
                        for (let index in data.value) {
                            if (maiorID < data.value[index].ID) { maiorID = data.value[index].ID }
                        }
                        maiorID++
                    },
                    error() {
                        MessageBox.error("Falha ao gerar novo ID.") 
                    }
                });
                this.getView().setBusy(false);
                // colocando novo ID na model
                this.getView().getModel("Calendario").setProperty("/ID", maiorID)
            },
            
            // Rota de cadastro doacoes
            handleRouteMatchedDoacoes: function(){
                // Seta titulo da pagina para Cadastro de doação
                this.getView().setModel(new JSONModel({
                    "title": "Cadastro de doação",
                    "texto": "Data Doação"
                }), "title");

                this.getView().setModel(new JSONModel({
                    "url": "AgendaDoacoesSet"
                }), "Calendario");    

                this.geraNovoID("AgendaDoacoesSet")
            },

            // Rota de cadastro Entregas
            handleRouteMatchedEntregas: function(){
                // Seta titulo da pagina para Cadastro de entrega
                this.getView().setModel(new JSONModel({
                    "title": "Cadastro de entrega",
                    "texto": "Data Entrega"
                }), "title");

                this.getView().setModel(new JSONModel({
                    "url": "AgendaEntregasSet"
                }), "Calendario");    
                console.log(this.getView().getModel('Calendario').getData())  

                this.geraNovoID("AgendaEntregasSet")
            },

            // Rota de edição Doacoes
            handleRouteMatchedEditarDoacoes: async function(){
                // Seta titulo da pagina para Editar doação
                this.getView().setModel(new JSONModel({
                    "title": "Editar doação"
                }), "title");

                var that = this;
                var id = this.getRouter().getHashChanger().getHash().split("/")[1];
                this.getView().setBusy(true);
                // Faz a chamada na API para pegar a doação selecionado na tabela.
                // Precisamos passar o ID na url para a API retornar apenas os dados do item selecionado.
                await 
                $.ajax({
                    "url": `/apiNairobi/AgendaDoacoesSet/${id}`, // concatena a URL com o ID
                    "method": "GET",
                    success(data) {
                        data.url = "AgendaDoacoesSet"
                        data.rota = "ConsultaCalendarioDoacoes"
                        that.getView().setModel(new JSONModel(data), "Calendario"); // salva o retorno da API (data) em um Model chamado 'Doacoe'
                    },
                    error() {
                        MessageBox.error("Não foi possível buscar os Calendarios.") //Se der erro de API, exibe uma mensagem ao usuário
                    }
                });

                           
                
                this.getView().setBusy(false);
            },

            // Rota de edição Entregas
            handleRouteMatchedEditarEntregas: async function(){
                // Seta titulo da pagina para Editar entrega
                this.getView().setModel(new JSONModel({
                    "title": "Editar entrega"
                }), "title");

                var that = this;
                var id = this.getRouter().getHashChanger().getHash().split("/")[1];
                this.getView().setBusy(true);
                // Faz a chamada na API para pegar a doação selecionado na tabela.
                // Precisamos passar o ID na url para a API retornar apenas os dados do item selecionado.
                await 
                $.ajax({
                    "url": `/apiNairobi/AgendaEntregasSet/${id}`, // concatena a URL com o ID
                    "method": "GET",
                    success(data) {
                        data.url = "AgendaEntregasSet"
                        data.rota = "ConsultaCalendarioEntregas"
                        that.getView().setModel(new JSONModel(data), "Calendario"); // salva o retorno da API (data) em um Model chamado 'Doacoe'
                    },
                    error() {
                        MessageBox.error("Não foi possível buscar os Calendarios.") //Se der erro de API, exibe uma mensagem ao usuário
                    }
                });

                           
                
                this.getView().setBusy(false);
            },

            // Função do botão "Confirmar"
            onConfirmar: async function(){
                var oCalendario = this.getView().getModel("Calendario").getData();
                var that = this;
                console.log(oCalendario)

                // formata data para padrao do BD
                if (oCalendario.data.split('/')[1]) {
                    oCalendario.data = oCalendario.data.split('/')
                    oCalendario.data = oCalendario.data[2] + '-' + oCalendario.data[1] + '-' + oCalendario.data[0]
                }

                console.log(oCalendario)

                // Primeiro é validado se a rota que estamos é a rota de 'EditarDoacoes'
                // Se for, o botão será responsável por atualizar (PUT) os dados
                // Senão, irá criar (POST) um novo registro na tabela
                if(this.getRouter().getHashChanger().getHash().search("EditarCalendario") === 0){

                    await $.ajax(`/apiNairobi/${oCalendario.url}/${oCalendario.ID}`, { // Concatena o ID do Doacoe selecionado na url
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // Cria a estrutura dos dados para enviar para API
                    data: JSON.stringify({
                        "data": oCalendario.data
                    }),
                    success() {
                        // Se a api retornar sucesso, exibe uma mensagem para o usuário e navega para a tela de "ConsultaDoacoes"
                        MessageBox.success("Editado com sucesso!", {
                            onClose: function() {
                                that.getRouter().navTo(oCalendario.rota);
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
                    await $.ajax(`/apiNairobi/${oCalendario.url}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify({
                            "ID": oCalendario.ID,
                            "data": oCalendario.data
                        }),
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
