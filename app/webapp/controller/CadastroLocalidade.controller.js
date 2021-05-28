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
                this.getRouter().getRoute("EditarLocalidade").attachPatternMatched(this.handleRouteMatchedEditarLocalidade, this);
            },
            
            // Rota de cadastro
            handleRouteMatched: async function(){
                // Inicia o model com o status "A" (ativo)
                this.getView().setModel(new JSONModel({
                    "status": "A" 
                }), "Localidade");

                // Seta titulo da pagina para Cadastro de Localidade
                this.getView().setModel(new JSONModel({
                    "title": "Cadastro de Localidades"
                }), "title");

                // Faz o novo ID
                this.geraNovoID()
            },

            geraNovoID: async function() {
                var maiorID = 0;
                await 
                $.ajax({
                    "url": `/apiNairobi/LocalidadesSet`, 
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
                this.getView().getModel("Localidade").setProperty("/ID", maiorID)
            },

            // Rota de edição
            handleRouteMatchedEditarLocalidade: async function(){
                // Seta titulo da pagina para Editar Localidade
                this.getView().setModel(new JSONModel({
                    "title": "Editar Localidade"
                }), "title");

                var that = this;

                // Pega o id do Localidade
                var id = this.getRouter().getHashChanger().getHash().split("/")[1];
                this.getView().setBusy(true);
                // Faz a chamada na API para pegar o Localidade selecionado na tabela.
                // Precisamos passar o ID na url para a API retornar apenas os dados do item selecionado.
                var localidade;
                await 
                $.ajax({
                    "url": `/apiNairobi/LocalidadesSet/${id}`, // concatena a URL com o ID
                    "method": "GET",
                    success(data) {
                        console.log(data)
                        localidade = data
                        that.getView().setModel(new JSONModel(localidade), "Localidade")
                    },
                    error() {
                        MessageBox.error("Não foi possível buscar as Localidades.") //Se der erro de API, exibe uma mensagem ao usuário
                    }
                });
                this.getView().setBusy(false);
            },

            formataCampos: function() {
                let erros = []
                // formata model Localidade
                let localidade = this.getView().getModel('Localidade').getData()
                if ((localidade.nPessoas).toString().indexOf("_") != -1) {
                    localidade.nPessoas = localidade.nPessoas.split('_')[0]
                }
                if ((localidade.nAnimais).toString().indexOf("_") != -1) {
                    localidade.nAnimais = localidade.nAnimais.split('_')[0]
                }
                
                localidade = {
                    "local": localidade.local,
                    "nPessoas": Number(localidade.nPessoas),
                    "nAnimais": Number(localidade.nAnimais)
                }
                this.getView().setModel(new JSONModel(localidade), 'Localidade')
            },

            // Função do botão "Confirmar"
            onConfirmar: async function(){
                // pegando id
                var oLocalidadeID = this.getView().getModel("Localidade").getData();
                oLocalidadeID = oLocalidadeID.ID

                // chama função para validar os campos
                this.formataCampos()
                let localidade = this.getView().getModel("Localidade").getData()
                var that = this;
                

                // Primeiro é validado se a rota que estamos é a rota de 'EditarVoluntarios'
                // Se for, o botão será responsável por atualizar (PUT) os dados
                // Senão, irá criar (POST) um novo registro na tabela
                if(this.getRouter().getHashChanger().getHash().search("EditarLocalidade") === 0){

                    await $.ajax(`/apiNairobi/LocalidadesSet/${oLocalidadeID}`, { // Concatena o ID do Voluntario selecionado na url
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // Cria a estrutura dos dados para enviar para API
                    data: JSON.stringify(localidade),
                    success() {
                        // Se a api retornar sucesso, exibe uma mensagem para o usuário e navega para a tela de "ConsultaVoluntarios"
                        MessageBox.success("Editado com sucesso!", {
                            onClose: function() {
                                that.getRouter().navTo("ConsultaLocalidade");
                            }
                        });
                    },
                    error() {
                        //Se a api retornar erro, exibe uma mensagem ao usuário
                        MessageBox.error("Não foi possível editar a Localidade.");
                    }
                });

                }else{
                    localidade.ID = oLocalidadeID
                    // Método POST para salvar os dados 
                    await $.ajax("/apiNairobi/LocalidadesSet", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(localidade),
                        success(){
                            MessageBox.success("Salvo com sucesso!");
                            that.geraNovoID()
                        },
                        error(){
                            MessageBox.error("Não foi possível salvar o Localidade.");
                        }
                    })


                }
            },

            // Função do botão Cancelar
            onCancelar: function(){
                // Se a rota for a de "EditarVoluntarios", navega para a tela de Consuta
                // Senão, limpa o model 'Voluntario'
                if(this.getRouter().getHashChanger().getHash().search("EditarLocalidade") === 0){
                    this.getRouter().navTo("ConsultaLocalidade");
                }else{
                    this.getView().setModel(new JSONModel({"status": "A"}), "Localidade")
                }
            }
		});
	});
