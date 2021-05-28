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
            handleRouteMatched: async function(){
                // Inicia o model com o status "A" (ativo)
                this.getView().setModel(new JSONModel({
                    "status": "A" 
                }), "Voluntario");

                // Seta titulo da pagina para Cadastro de Voluntarios
                this.getView().setModel(new JSONModel({
                    "title": "Cadastro de Voluntarios"
                }), "title");

                // Busca todas as funções
                var that = this;
                var funcoes
                await
                $.ajax({
                    "url": "/apiNairobi/FuncoesSet",
                    "method": "GET",
                    success(data){
                        funcoes = data.value
                        that.getView().setModel(new JSONModel(funcoes), "Funcoes")
                    },
                    error(){
                        MessageBox.error("Não foi possível buscar os Voluntarios.")
                    }
                })
                // Faz o novo ID
                this.geraNovoID()
            },

            geraNovoID: async function() {
                var maiorID = 0;
                await 
                $.ajax({
                    "url": `/apiNairobi/VoluntariosSet`, 
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
                this.getView().getModel("Voluntario").setProperty("/ID", maiorID)
            },

            // Rota de edição
            handleRouteMatchedEditarVoluntario: async function(){
                // Seta titulo da pagina para Editar Voluntario
                this.getView().setModel(new JSONModel({
                    "title": "Editar Voluntario"
                }), "title");

                var that = this;

                // Busca todas as funções
                var funcoes
                await
                $.ajax({
                    "url": "/apiNairobi/FuncoesSet",
                    "method": "GET",
                    success(data){
                        funcoes = data.value
                        that.getView().setModel(new JSONModel(funcoes), "Funcoes")
                    },
                    error(){
                        MessageBox.error("Não foi possível buscar os Voluntarios.")
                    }
                })


                // Pega o id do voluntario
                var id = this.getRouter().getHashChanger().getHash().split("/")[1];
                this.getView().setBusy(true);
                // Faz a chamada na API para pegar o voluntario selecionado na tabela.
                // Precisamos passar o ID na url para a API retornar apenas os dados do item selecionado.
                var voluntario;
                await 
                $.ajax({
                    "url": `/apiNairobi/VoluntariosSet/${id}`, // concatena a URL com o ID
                    "method": "GET",
                    success(data) {
                        voluntario = data
                        that.getView().setModel(new JSONModel(voluntario), "Voluntario")
                    },
                    error() {
                        MessageBox.error("Não foi possível buscar os Voluntarios.") //Se der erro de API, exibe uma mensagem ao usuário
                    }
                });
                this.getView().setBusy(false);
            },

            formataCampos: function() {
                let erros = []
                // formata model Voluntario
                let voluntario = this.getView().getModel('Voluntario').getData()

                // formata data para salvar corretamente no banco de dados
                // Se a data estiver no formato dd/mm/aaaa ele formata para aaaa-mm-dd
                let dataFormatada
                if (voluntario.dataNascimento.split('/')[1]) {
                    dataFormatada = voluntario.dataNascimento.split('/')
                    dataFormatada = dataFormatada[2] + '-' + dataFormatada[1] + '-' + dataFormatada[0]
                }
                voluntario = {
                    "nome": voluntario.nome,
                    "dataNascimento": dataFormatada ? dataFormatada : voluntario.dataNascimento,
                    "identificacao": voluntario.identificacao,
                    "tipo_ID": Number(voluntario.tipo_ID),
                    "endereco": voluntario.endereco,
                    "cep": voluntario.cep,
                    "horaDisponivel": voluntario.horaDisponivel,
                    "diaDisponivel": voluntario.diaDisponivel,
                    "telefone": voluntario.telefone,
                    "email": voluntario.email
                }
                this.getView().setModel(new JSONModel(voluntario), 'Voluntario')
            },

            // Função do botão "Confirmar"
            onConfirmar: async function(){
                // pegando id
                var oVoluntarioID = this.getView().getModel("Voluntario").getData();
                oVoluntarioID = oVoluntarioID.ID

                // chama função para validar os campos
                this.formataCampos()
                let voluntario = this.getView().getModel("Voluntario").getData()
                var that = this;
                

                // Primeiro é validado se a rota que estamos é a rota de 'EditarVoluntarios'
                // Se for, o botão será responsável por atualizar (PUT) os dados
                // Senão, irá criar (POST) um novo registro na tabela
                if(this.getRouter().getHashChanger().getHash().search("EditarVoluntarios") === 0){

                    await $.ajax(`/apiNairobi/VoluntariosSet/${oVoluntarioID}`, { // Concatena o ID do Voluntario selecionado na url
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // Cria a estrutura dos dados para enviar para API
                    data: JSON.stringify(voluntario),
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
                    voluntario.ID = oVoluntarioID
                    // Método POST para salvar os dados 
                    await $.ajax("/apiNairobi/VoluntariosSet", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(voluntario),
                        success(){
                            MessageBox.success("Salvo com sucesso!");
                            that.geraNovoID()
                        },
                        error(){
                            MessageBox.error("Não foi possível salvar o Voluntario.");
                        }
                    })


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
