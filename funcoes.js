const fs = require("fs");
var oracledb = require("oracledb");
function geraJSON(pdfBase) {

  let JSONFinal = {
    "Result": 1,
    "Message": "DEMONSTRATIVO - IRPF PDF",
    "Data": {
      "nome": "irpf.pdf",
      "file64": `${pdfBase.toString()}`,
      "mimeType": "application/pdf"
    },
    "AlertData": null,
    "NavigationData": null
  }
  return JSONFinal;
}

async function geraPDF(txtBase, nomeBenef, cpfTitular, titulo, dataEmissao, pdf) {

  return new Promise((resolve, reject) => {
    try {
      const date = new Date().toLocaleString();
      dataEmissao = dataEmissao.replace('data', date)
      const chunks = [];
      pdf.setMaxListeners(15);
      pdf.image(__dirname + "/util/cabecalho.jpg", 10, 10, {
        width: 580,
      });
      pdf.fontSize(11).text(txtBase, 70, 195, { align: "center" });
      pdf.text("NOME: " + nomeBenef, 50, 140);
      pdf.text("CPF: " + cpfTitular, 425, 140);
      var cont = false;
      var altura = 317;
      for (let i = 0; i < titulo.length; i++) {

        var element = titulo[i];

        if (cont) {
          altura += 40;
        }
        pdf.text(element[0].nome, 45, altura, {
          align: "left",
          width: 200,
        });
        pdf.fontSize(10).text(element[1].grauDep, 250, altura);
        pdf.text(element[2].dnBenef, 335, altura);
        pdf.text(element[3].cpfBenef, 410, altura);
        pdf.text(element[4].valor, 500, altura, {
          align: "left",
          width: 200,
        });
        cont = true;
      }

      pdf.image(__dirname + "/util/rodape.jpg", 10, 570, {
        width: 580,
      });
      pdf.image(__dirname + "/util/assinatura.jpg", 10, 650, {
        width: 580,
      });
      pdf.fontSize(8).text(dataEmissao, 70, 750, { align: "center" })
      pdf.text("1/1", 500, 730, { align: "right", width: 58 });

      pdf.on("data", (chunk) => {
        chunks.push(chunk);
      });

      pdf.on("end", () => {
        const result = Buffer.concat(chunks).toString("base64");
        resolve(result);
      });

      pdf.end();
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      reject(error);
    }
  });
}


async function geraTitulo(data) {

  return new Promise((resolve, reject) => {
    awaitTitulo(data)
      .then((titulo) => {
        resolve(titulo)
      }).catch((e) => {
        console.log((e));
      })
  })
}
async function awaitTitulo(data) {
  var titulo = [];
  var element = data.Data[1].itens[0];

  var itensTitulo = [];
  let cpfBenef = element.detalhes[0].Campo;
  let nomeBenef = element.detalhes[1].Campo;
  let dnBenef = element.detalhes[2].Campo
  if (dnBenef == null) {
    dnBenef = ''
  } else {
    ; dnBenef = element.detalhes[2].Campo
  }
  let valorTitulo = element.valorFormatado;
  let grauDep = element.detalhes[1].Titulo;

  itensTitulo.push({ nome: `${nomeBenef}` });
  itensTitulo.push({ grauDep: `${grauDep}` });
  itensTitulo.push({ dnBenef: `${dnBenef}` });
  itensTitulo.push({ cpfBenef: `${cpfBenef}` });
  itensTitulo.push({ valor: `${valorTitulo}` });
  titulo.push(itensTitulo);
  element = '';

  for (let i = 1; i < data.Data[2].itens.length; i++) {
    if (data.Data[2].itens[0] == undefined) {
      break;
    }
    else {

      var element = data.Data[2].itens[i];

      var itensTitulo = [];
      let cpfBenef = element.detalhes[0].Campo;
      let nomeBenef = element.detalhes[1].Campo;
      let dnBenef = element.detalhes[2].Campo
      if (dnBenef == null) {
        dnBenef = ''
      } else {
        ; dnBenef = element.detalhes[2].Campo
      }
      let valorTitulo = element.valorFormatado;
      let grauDep = element.detalhes[1].Titulo;

      itensTitulo.push({ nome: `${nomeBenef}` });
      itensTitulo.push({ grauDep: `${grauDep}` });
      itensTitulo.push({ dnBenef: `${dnBenef}` });
      itensTitulo.push({ cpfBenef: `${cpfBenef}` });
      itensTitulo.push({ valor: `${valorTitulo}` });
      titulo.push(itensTitulo);
      element = '';
    }
  }
  var titulos = titulo;
  return titulos;
}

function buscaAPI(URL, cpfTitular, password, anoBase, carteira) {

  return new Promise((resolve, reject) => {
    URL = URL.replace("%%%%", anoBase);
    let data = fetchApi(URL, cpfTitular, password, carteira);
    resolve(data)

  })

  function fetchApi(URL, cpfTitular, password, carteira) {
    return fetch(URL, {
      method: "GET",
      headers: {
        "x-cpf": cpfTitular,
        "x-carteira": carteira,
        Authorization: password
      }
    }).then(result => result.json())

  }
}
function validaIP(password, carteira, unidade, notFound, res) {
  if (password == "" || carteira == "" || unidade != "XX") {
    return res.end(notFound);
  }
}
function formataTextos(titulo, txtBase, anoBase) {

  let nomeTitular = titulo[0][0].nome
  txtBase = txtBase.replace("nomeBenef", nomeTitular);
  txtBase = txtBase.replace("anoBase", anoBase - 1);
  return { txtBase, nomeTitular };
}


function carregaVariavel(variavel) {
  try {
    var varCarregada = fs.readFileSync(
      __dirname + "/util/" + variavel + ".json",
      function (err, data) { }
    );
  } catch (error) {
    console.log(
      console.log(
        "                          Atenção!!! \n\n Houve um erro ao carregar um dos arquivos \n"
      )
    );
  }

  if (varCarregada != undefined) {
    console.log(
      "\n" +
      " O arquivo :       " +
      variavel +
      "\n  Foi carregado com sucesso!!! \n---------------------------------------------------"
    );
    return varCarregada;
  } else {
    console.log(
      "  Falha ao carregar o arquivo " +
      variavel +
      "!!! \n---------------------------------------------------"
    );
  }
}
function geraSelect() {

  const consReajuste = fs.readFileSync(
    __dirname + "/select.txt",
    function (err, data) {
      if (err) throw err;
    }
  );
  return consReajuste;
}

async function geraJsonFormatado(itemsJson, itensReajuste, adesao) {
  let itensArquivo = [];
  let periodosArquivo = [];
  let periodosReajuste = [];
  let detalhesArquivo = [];
  let detalhesReajuste = [];
  let dataArquivo = [];
  let dataReajuste = [];
  let dataCompleta = [];


  if (itemsJson != 'empresarial') {

    for (let i = 0; i < itemsJson.length; i++) {
      if (itemsJson[i][1] != 0) {
        detalhesArquivo.push({
          Titulo: "Autorizacao ANS",
          Campo: `${itemsJson[i][2]}`,
        });
        periodosArquivo.push({
          periodo: `${itemsJson[i][0]}`,
          percentualReajuste: `${itemsJson[i][1]}`,
          exibirBotaoExtratoPdf: 0,
          detalhes: [],
        });
        periodosArquivo[i].detalhes.push(detalhesArquivo[i]);
        dataArquivo.push(periodosArquivo[i]);
      }
    }
  }
  //api banco
  if (itensReajuste.length != 0) {
    for (let i = 0; i < itensReajuste.length; i++) {
      detalhesReajuste.push({});
      periodosReajuste.push({
        periodo: `${itensReajuste[i][0]}`,
        percentualReajuste: `${itensReajuste[i][1]}`.substring(0, 4),
        exibirBotaoExtratoPdf: 0,
        detalhes: [],
      });
      periodosReajuste[i].detalhes.push(detalhesReajuste[i]);
      dataReajuste.push(periodosReajuste[i]);
    }

    dataCompleta.push({
      categoria: " Reenquadramento Faixa Etária ",
      periodos: dataReajuste,
    });
  }
  if (itemsJson != "empresarial") {
    dataCompleta.push({
      categoria: " Reajuste Contratual ",
      periodos: dataArquivo,
    });
  } else {
    dataCompleta.push({
      categoria: " * Para reajuste anuais, Verificar junto ao RH da sua empresa. ",
      periodos: dataArquivo,
    });
  }
  let returnJson = {
    Result: 1,
    Message: "Reajuste de plano",
    Data: dataCompleta,
  };
  return returnJson;
}


function validaModalidade(modalidade, contractEmpre) {
  let controle = false;
  let contratos = JSON.parse(contractEmpre);

  for (let L = 0; L < contratos.contratos.length; L++) {
    if (contratos.contratos[L] == modalidade) {
      controle = true;
      break;
    }
  }
  return controle;
}



async function consultaDB(cartao, consultReajuste) {
  var selectReaj = consultReajuste.toString();
  selectReaj = selectReaj.replace("&cartaoUsuario", cartao.substr(4));
  selectReaj = selectReaj.replace("&unidade", cartao.substr(0, 4));
  const clientOpts = { libDir: "C:/oracle/instantclient_11_2" };
  const config = {
    user: "user",
    password: "password",
    connectString: "{{hostBanco}}",
  };

  try {
    oracledb.initOracleClient(clientOpts);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  var valorSelect = await returnReajust();
  async function returnReajust() {
    try {
      const connection = await oracledb.getConnection(config);
      const result = await connection.execute(selectReaj);
      doRelease(connection);
      return result.rows;
    } catch (e) {
      console.log(e);
    }
  }

  function doRelease(connection) {
    connection.close(function (err) {
      if (err) console.error(err.message);
    });
  }

  return valorSelect;
}


module.exports = {
  buscaAPI,
  awaitTitulo,
  geraTitulo,
  geraJSON,
  geraPDF,
  validaIP,
  formataTextos,
  carregaVariavel,
  geraSelect,
  validaModalidade,
  consultaDB,
  geraJsonFormatado
};