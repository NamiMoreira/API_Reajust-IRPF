function executaPDF(fc,req,notFound,res,homologa,notFoundBenef){

  const PDFKit = require("pdfkit");
  const pdf = new PDFKit({
      layout: "portrait",
      size: "A4",
    });
  var password = req.headers.authorization;
  var carteira = req.headers["x-carteira"];
  var cpfTitular = req.headers["x-cpf"];
  var unidade = req.headers["x-coopid"];
  var anoBase = req.query["ano"];
  var txtBase = "DECLARAMOS que nomeBenef efetuou os pagamentos relacionados abaixo à Empresa (CNPJ: ) referente ao ano calendário de anoBase do Plano de Saúde contratado.";
  var dataEmissao = "Emitido : data "
  var nomeTitular;
  var valorTitulo;
  var titulo = [];
  var URL = "{{hostAPI}}/IRPF?ano=%%%%";
  var  cpfBenef;
  var  nomeBenef ;
  var  dnBenef ;
  var  valorTitulo;
  var  grauDep ;

  validaIP(password,carteira,unidade,notFound,res,cpfTitular);
 
  fc.buscaAPI(URL,cpfTitular,password,anoBase,carteira)
    .then((response)=>{

        if (response.Data[0] != undefined) {
        let titulo = fc.geraTitulo(response)
        return titulo;
        }else{ res.end(notFoundBenef)}
     })

    .catch((e)=>{
      console.log(e);
    })

    .then((titulo)=>{
      let retorno =  fc.formataTextos(titulo,txtBase,anoBase);
      txtBase = retorno.txtBase   ;
      nomeTitular = retorno.nomeTitular;
      var pdfBase = fc.geraPDF(txtBase, nomeTitular, cpfTitular, titulo,dataEmissao,pdf);
      return pdfBase
    })

    .catch((e)=>{
      console.log(e);
    })

    .then((pdfBase)=>{
      // res.end(pdfBase)
      let JSONFinal = fc.geraJSON(pdfBase);
        res.end(JSON.stringify(JSONFinal));
    })

    .catch((e)=>{
      console.log(e);
    });
}

  module.exports = {executaPDF};