/***********************************************************************
 * OBJETIVO: Criar uma API para disponibilizar dados de Estados e Cidades
 * Data: 03/03/2023
 * Autor: Gustavo
 * Versão: 1.0 
 ************************************************************************/

//Dependência para cirar as requisições da API
const express = require('express')

//Dependência para gerenciar as permissões da API
const cors = require('cors')

//Dependência para gerenciar o corpo das requisições da API
const bodyParser = require('body-parser')

//Import do arquivo no modulo (funções)
const estadosCidades = require('./module.js')
const { request, response } = require('express')

//Cria um objeto com as características do express
const app = express()

app.use((request, response, next) => {

    //API publica- fica disponível para utlização de qualquer aplicação
    //API privada - somemte o IP informado poderá consumir dados da API

    //Define se a API será publica ou privada
    response.header('Acess-Control-Allow-Origin', '*'/*nolugar do asterísco voceê pode colocar um ip para tornar a API privada*/)

    //Permite definir quais metodos poderão ser utilizadas nas requisições da API
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    //Envia para o cors() as regras de permissões
    app.use(cors())

    next()
})

//EndPoint
//async - estabelece um status de aguarde, assim que eu processar, te devolvo os dados
//obs: se não usar o asyn, a requisição é perdida pois o front acha que API está do ar

//Endpoint para listar todos os estados
app.get('/v1/senai/estados', cors(), async function (request, response, next) {

    //Chama a função que vai listar todos os estados 
    let estados = estadosCidades.getListaDeEstados()

    console.log(estados)

    //Tratamento para validar o sucesso da requisição
    if (estados) {
        response.status(200)
        response.json(estados)
    } else {
        response.status(500)
        response.json()
    }
})
//EndPoint: Listar os dados do estado filtrando pela sigla do estado
app.get('/v1/senai/estado/sigla/:uf', cors(), async function (request, response, next) {

    let statusCode
    let dadosEstado = {}

    //Recebe a sigla do estado que será enviada pela URL da requisição
    let siglaEstado = request.params.uf

    //Tratamento para validação de entrada de dados incorreta
    if (siglaEstado.length != 2 || !isNaN(siglaEstado) || siglaEstado == undefined || siglaEstado == '') {

        statusCode = 400

        dadosEstado.message = 'Não foi possível acessar os dados de entrada (uf) que foi enviado, pois não corresponde ao exigido, confira o valor,  pois não pode ser vazio, precisa ser caracteres e ter duas letras'

    } else {
        //Chama a função para retornar os dados do contato
        let estado = estadosCidades.getDadosEstado(siglaEstado)

        if (estado) {
            statusCode = 200
            dadosEstado = estado
        } else {
            statusCode = 404
        }
    }

    //Retorna o codigo e o JSON
    response.status(statusCode)
    response.json(dadosEstado)
})

app.get('/v1/senai/estado/capital/:uf', cors(), async function (request, response, next) {

    let statusCode
    let dadosEstado = {}

    let siglaCapital = request.params.uf

    if (siglaCapital.length != 2 || !isNaN(siglaCapital) || siglaCapital == undefined || siglaCapital == '') {

        statusCode = 400

        dadosEstado.message = 'Não foi possível acessar os dados de entrada (uf) que foi enviado, pois não corresponde ao exigido, confira o valor,  pois não pode ser vazio, precisa ser caracteres e ter duas letras'
    } else {

        let capital = estadosCidades.getCapitalEstado(siglaCapital)

        if (capital) {
            statusCode = 200
            dadosEstado = capital
        } else {
            statusCode = 404
        }
    }
    response.status(statusCode)
    response.json(dadosEstado)
})

app.get('/v1/senai/estado/regiao/:regiao', cors(), async function (request, response, next) {
    let statusCode
    let dadosRegiao = {}

    let nomeRegiao = request.params.regiao

    if (!isNaN(nomeRegiao) || nomeRegiao == undefined || nomeRegiao == '') {
        statusCode = 400

        dadosRegiao.message = 'Não foi possível acessar os dados de entrada (uf) que foi enviado, pois não corresponde ao exigido, confira o valor,  pois não pode ser vazio, precisa ser caracteres e ter duas letras'

    } else {

        let regiao = estadosCidades.getEstadosRegiao(nomeRegiao)

        if (regiao) {
            statusCode = 200
            dadosRegiao = regiao
        } else {
            statusCode = 404
        }
    }
    response.status(statusCode)
    response.json(dadosRegiao)
})

app.get('/v1/senia/pais/capital/', cors(), async function (request, response, next) {


    let statusCode
    let dadosCapital = {}



    let capital = estadosCidades.getCapitalPais()

    if (capital) {
        statusCode = 200
        dadosCapital = capital
    } else {
        statusCode = 404
    }

    response.status(statusCode)
    response.json(dadosCapital)
})

app.get('/v1/senai/cidades/estado/siglas/:uf', cors(), async function (request, response, next) {

    let statusCode
    let dadosCidades = {}
    let siglaCidade = request.params.uf



    if (siglaCidade.length != 2 || !isNaN(siglaCidade) || siglaCidade == undefined || siglaCidade == '') {

        statusCode = 400

        dadosEstado.message = 'Não foi possível acessar os dados de entrada (uf) que foi enviado, pois não corresponde ao exigido, confira o valor,  pois não pode ser vazio, precisa ser caracteres e ter duas letras'
    } else {
        let cidades = estadosCidades.getCidades(siglaCidade)

        if (cidades) {
            statusCode = 200
            dadosCidades = cidades
        } else {
            statusCode = 404
        }
    }
    response.status(statusCode)
    response.json(dadosCidades)

})

app.get('/v2/senai/cidades', cors(), async function (request, response, next) {

    /*
        Existe duas opções para receer variáveis para filtro:

            -perams-que permite receber a variavel na estrutura da URL
            craiada no entPoint (geralmente utilizado para ID (PK))

            -query- também conhceido como QueryString  per permite receber uma ou muitas variaves para 
            realizar filtros  avançados
    
    */

    //Recebe uma variavel encaminhada via QueryString 
    let siglaEstado = request.query.uf;
    //let cepEstado = request.query.cep;
    //let populacaoEstado = request.query.populacao;

    let statusCode
    let dadosCidades = {}



    if (siglaCidade.length != 2 || !isNaN(siglaCidade) || siglaCidade == undefined || siglaCidade == '') {

        statusCode = 400

        dadosEstado.message = 'Não foi possível acessar os dados de entrada (uf) que foi enviado, pois não corresponde ao exigido, confira o valor,  pois não pode ser vazio, precisa ser caracteres e ter duas letras'
    } else {
        let cidades = estadosCidades.getCidades(siglaCidade)

        if (cidades) {
            statusCode = 200
            dadosCidades = cidades
        } else {
            statusCode = 404
        }
    }
    response.status(statusCode)
    response.json(dadosCidades)


})


//Roda o serviço da API para ficar aguardando requisições
app.listen(8080, function () {
    console.log('Servidor aguardando requisições na porta 8080.')
})

