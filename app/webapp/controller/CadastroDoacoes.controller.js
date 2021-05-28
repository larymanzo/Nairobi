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
                this.getRouter().getRoute("EditarDoacoes").attachPatternMatched(this.handleRouteMatchedEditarDoacoe, this);
            },
            
            // Rota de cadastro
            handleRouteMatched: async function(){
                // Inicia o model com o status "A" (ativo)
                this.getView().setModel(new JSONModel({
                    "title": "Cadastro de doações" 
                }), "title");

                this.getView().setModel(new JSONModel(), "Doacao");    
                this.geraNovoID()

                // Busca todas os voluntários
                var voluntarios
                var that = this
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
            },

            geraNovoID: async function() {
                var maiorID = 0;
                await 
                $.ajax({
                    "url": `/apiNairobi/DoacoesSet`, 
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
                this.getView().getModel("Doacao").setProperty("/ID", maiorID)
            },

            // Rota de edição
            handleRouteMatchedEditarDoacoe: async function(){
                this.getView().setModel(new JSONModel({
                    "title": "Editar doação" 
                }), "title");
                var that = this;

                 // Busca todas os voluntários
                var voluntarios
                var that = this
                await
                $.ajax({
                    "url": "/apiNairobi/VoluntariosSet",
                    "method": "GET",
                    success(data){
                        voluntarios = data.value
                        console.log(voluntarios)
                        that.getView().setModel(new JSONModel(voluntarios), "Voluntarios")
                    },
                    error(){
                        MessageBox.error("Não foi possível buscar os Voluntarios.")
                    }
                }) 

                var id = this.getRouter().getHashChanger().getHash().split("/")[1];
                this.getView().setBusy(true);
                // Faz a chamada na API para pegar a doação selecionado na tabela.
                // Precisamos passar o ID na url para a API retornar apenas os dados do item selecionado.
                await 
                $.ajax({
                    "url": `/apiNairobi/DoacoesSet/${id}`, // concatena a URL com o ID
                    "method": "GET",
                    success(data) {
                        that.getView().setModel(new JSONModel(data), "Doacao"); // salva o retorno da API (data) em um Model chamado 'Doacoe'
                    },
                    error() {
                        MessageBox.error("Não foi possível buscar as Doações.") //Se der erro de API, exibe uma mensagem ao usuário
                    }
                });

                           
                
                this.getView().setBusy(false);
            },

            // Função do botão "Confirmar"
            onConfirmar: async function(){
                var oDoacao = this.getView().getModel("Doacao").getData();
                console.log(oDoacao)
                var that = this;
                console.log(oDoacao)

                // Primeiro é validado se a rota que estamos é a rota de 'EditarDoacoes'
                // Se for, o botão será responsável por atualizar (PUT) os dados
                // Senão, irá criar (POST) um novo registro na tabela
                if(this.getRouter().getHashChanger().getHash().search("EditarDoacoes") === 0){

                    await $.ajax(`/apiNairobi/DoacoesSet/${oDoacao.ID}`, { // Concatena o ID do Doacoe selecionado na url
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // Cria a estrutura dos dados para enviar para API
                    data: JSON.stringify({
                        "descricao": oDoacao.descricao,
                        "quantidade": oDoacao.quantidade.indexOf('_') == -1 ? Number(oDoacao.quantidade) : Number(oDoacao.quantidade.split('_')[0]),
                        "unidade": oDoacao.unidade,
                        "perecivel": oDoacao.perecivel == 'Sim'? true : false,
                        "periodoDoacao": oDoacao.periodoDoacao,
                        "voluntario_ID": Number(oDoacao.voluntario_ID)
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
                    oDoacao.perecivel = oDoacao.perecivel == 'Sim'? true : false,
                    oDoacao.quantidade = oDoacao.quantidade.indexOf('_') == -1 ? Number(oDoacao.quantidade) : Number(oDoacao.quantidade.split('_')[0]),
                    oDoacao.voluntario_ID = Number(oDoacao.voluntario_ID)
                    await $.ajax("/apiNairobi/DoacoesSet", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(oDoacao),
                        success(){
                            MessageBox.success("Salvo com sucesso!");
                            that.handleRouteMatched()
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
                // Se a rota for a de "EditarDoacoes", navega para a tela de Consulta
                // Senão, limpa o model 'Doacoe'
                if(this.getRouter().getHashChanger().getHash().search("EditarDoacoes") === 0){
                    this.getRouter().navTo("ConsultaDoacoes");
                }else{
                    this.getView().setModel(new JSONModel({"status": "A"}), "Doacao")
                }
            }
		});
	});
