

function execReaj(fc,req,notFound,res,range,contractEmpre,consultReajuste){

        var password        = req.headers.authorization;
        var carteira        = req.headers["x-carteira"];
        var modalidade      = carteira.substring(4, 6);
        var contrato        = carteira.substring(6, 11);
        var unidade         = req.headers["x-coopid"];
        var ipUser          = req.socket.remoteAddress;
        var ipuserJump      = req.client._peername.address;
        var contadorErro    = true;
        var contratEmpresarial = false;

       

if (password == "" || carteira == "" || unidade != "XX") {
  res.end(notFound);
} else {
  const rangeIps = JSON.parse(range);

  

  for (let a = 0; a < rangeIps.rangeIP.length; a++) {
    if (rangeIps.rangeIP[a] == ipUser) {
      var contratoEmpresarial = fc.validaModalidade(modalidade,contractEmpre);
      if (contratoEmpresarial) {
        contratEmpresarial = true;
      }

      //busca dados na api 
      var URL =
        "{{hostAPI}}" +
        modalidade +
        "/" +
        contrato +
        "/...";
      (async () => {
        let response = await fetch(URL, {
          method: "GET",
          headers: { Authorization: password },
        });
        let data = await response.json();
        //trata erros de conexão
        if (response.status < 200 || response.status > 299) {
          fs.readFile(__dirname + "/util/error.json", function (err, data) {
            console.log("erro");
            res.end(data);
          });
        } else {
          //trata retorno da API Totvs
          let formFormated = JSON.stringify(data);
          let quantItens = data.total;
          let itemsData = [];
          

          for (let l = 0; l < quantItens; l++) {
            let periodo =
              `${data.items[l].increaseMonth}` +
              "/" +
              `${data.items[l].billingYear}`;
            let percentReaj = data.items[l].increasePercentage;
            let autReaj;
            if (data.items[l].protocolNumber != null) {
              autReaj = data.items[l].protocolNumber;
            } else {
              autReaj = "";
            }

            let items = [];
            items.push(periodo);
            items.push(percentReaj);
            items.push(autReaj);
            itemsData.push(items);
          }

          if (itemsData.length == 0) {
            res.end(notFoundBenef);
          } else {
            //chama função para formatar o retorno e envia
            try {
              if (contratEmpresarial) {
                var reajusteFaixaEtaria = await fc.consultaDB(carteira,consultReajuste);
                var jsonFormatado = await fc.geraJsonFormatado("empresarial",reajusteFaixaEtaria);
              } else {
                var reajusteFaixaEtaria = await fc.consultaDB(carteira,consultReajuste);
                var jsonFormatado = await fc.geraJsonFormatado(itemsData,reajusteFaixaEtaria)}
            } catch (e) {
              console.log(e);
            }
            res.end(JSON.stringify(jsonFormatado));
            
          }
        }
      })();
      contadorErro = false;
      break;
    } else {
      contadorErro = true;
    }
  }
  if (contadorErro) {
    res.end(varError);
  }
}
}
module.exports = {execReaj};
