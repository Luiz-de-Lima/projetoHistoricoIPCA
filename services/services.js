const dadosInflacao = require('../data/data.js')

//funções de listar todos os dados
//função de buscar por ano feita
//função de busca por ID feita

//para fazer, função de calcula o ipca
function listarDadosInflacao() {
    return dadosInflacao;
}
function buscarInflacaoPorAno(ano) {
    const anoBuscado = parseInt(ano)
    return dadosInflacao.filter(item => item.ano === anoBuscado)
}

function buscarInflacaoPorId(id) {
    const idBuscado = parseInt(id)
    return dadosInflacao.find(item => item.id === idBuscado);
}
function anoMesParaNumero(ano, mes) {
    return ano * 100 + mes
}
function buscarIpcaEntreDatas(mesInicial, anoInicial, mesFinal, anoFinal) {
    const inicio = anoMesParaNumero(mesInicial, anoInicial)
    const final = anoMesParaNumero(mesFinal, anoFinal)

    return dadosInflacao.filter(item => {
        const dataItem = anoMesParaNumero(item.ano, item.mes)
        return dataItem >= inicio && dataItem <= final
    })
        .map(item => item.ipca)
}
function calcularReajusteIPCA(valorInicial, ipcas) {
    let valorFinal = valorInicial
    for (const ipca of ipcas) {
        valorFinal *= 1 + ipca / 100
    }
    return Number(valorFinal.toFixed(2))
}

function validarAnoHistoricoIPCA(ano) {
    return ano >= 2015 && ano <= 2023;
}
function validarIntervaloDatas(mesInicial, anoInicial, mesFinal, anoFinal) {
    if (anoInicial > anoFinal) return false;
    if (anoInicial === anoFinal && mesInicial > mesFinal) return false;
    return true;
}

module.exports = { listarDadosInflacao, buscarInflacaoPorAno, buscarIpcaEntreDatas, buscarInflacaoPorId, calcularReajusteIPCA, validarAnoHistoricoIPCA }