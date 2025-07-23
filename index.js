const express = require('express')
const services = require('./services/services.js')

const app = express()

const listarDados = services.listarDadosInflacao()
const ListarDadosPorAno = services.buscarInflacaoPorAno
const buscarHistoricoPorId = services.buscarInflacaoPorId
const calculoReajusteIpca = services.calcularReajusteIPCA
const buscarIpcaDatas = services.buscarIpcaEntreDatas

app.get('/', (req, res) => {
    res.json(listarDados);
});

app.get('/historicoIPCA', (req, res) => {
    const ano = req.query.ano
    if (ano) {
        const resultado = ListarDadosPorAno(ano);

        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.status(404).json({ erro: 'Ano não encontrado' });
        }
    } else {
        res.json(listarDados);
    }
})

app.get('/historicoIPCA/calculo', (req, res) => {
    const valor = parseFloat(req.query.valor)
    const dataInicialMes = parseInt(req.query.mesInicial)
    const dataInicialAno = parseInt(req.query.anoInicial)
    const dataFinalMes = parseInt(req.query.mesFinal)
    const dataFinalAno = parseInt(req.query.anoFinal)

    if (!valor || !dataInicialMes || !dataInicialAno || !dataFinalMes || !dataFinalAno) {
        return res.status(400).json({ erro: 'Parâmetros obrigatórios faltando' });
    }
    if (isNaN(valor)) {
        return res.status(400).json({ erro: 'O valor deve ser um número' });
    }
    const ipcas = buscarIpcaDatas(valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno)
    if (ipcas.length === 0) {
        return res.status(404).json({ erro: 'Sem dados de IPCA para o período informado' });
    }
    const reajusteIpca = calculoReajusteIpca(valor, ipcas)
    res.json({
        valorOriginal: valor, de: `${dataInicialMes}/${dataInicialAno}`,
        ate: `${dataFinalMes}/${dataFinalAno}`, ipcas, reajusteIpca
    })
})

app.get('/historicoIPCA/:id', (req, res) => {
    const idIPCA = req.params.id
    if (idIPCA && idIPCA <= 100) {
        const resultado = buscarHistoricoPorId(idIPCA)
        res.json(resultado)
    } else {
        res.status(404).json({ erro: 'ID não encontrado' });
    }
})



app.listen(8080, () => {
    console.log('Servidor iniciado na porta 8080');
});