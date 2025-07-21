import { ValidadeData } from "./ValidadeData";

class FormatData {
  async execute(data, ageRangeadjustment, contractual) {
    const validadeData = new ValidadeData();
    var itensArquivo = [];
    var periodosArquivo = [];
    var periodosReajuste = [];
    var detalhesArquivo = [];
    var detalhesReajuste = [];
    var dataArquivo = [];
    var dataReajuste = [];
    var dataCompleta = [];

    if (contractual) {
      const Rangeadjustment = ageAdjustment(ageRangeadjustment);
      if (Rangeadjustment != null) {
        dataCompleta.push({
          categoria: " Reajuste Faixa Etária ",
          periodos: Rangeadjustment,
        });
      }
      dataCompleta.push({
        categoria:
          " * Para reajuste anuais, Verificar junto ao RH da sua empresa. ",
        periodos: dataArquivo,
      });
    } else {
      console.log(data);

      let completeHeadpiece = [];
      for (let l = 0; l < data.total; l++) {
        let period =
          `${data.items[l].increaseMonth}` +
          "/" +
          `${data.items[l].billingYear}`;
        let adjustmentPercentage = data.items[l].increasePercentage;
        let reajustAuthorization = "";
        if (data.items[l].protocolNumber != null) {
          reajustAuthorization = data.items[l].protocolNumber;
        }
        let items = [];
        items.push(period);
        items.push(adjustmentPercentage);
        items.push(reajustAuthorization);
        completeHeadpiece.push(items);
      }
      if (completeHeadpiece.length == 0) {
        const validate = await validadeData.execute("notFoundBenef");
        return validate;
      }

      for (let i = 0; i < completeHeadpiece.length; i++) {
        if (completeHeadpiece[i][1] != 0) {
          detalhesArquivo.push({
            Titulo: "Autorizacao ANS",
            Campo: `${completeHeadpiece[i][2]}`,
          });
          periodosArquivo.push({
            periodo: `${completeHeadpiece[i][0]}`,
            percentualReajuste: `${completeHeadpiece[i][1]}`,
            exibirBotaoExtratoPdf: 0,
            detalhes: [],
          });
          periodosArquivo[i].detalhes.push(detalhesArquivo[i]);
          dataArquivo.push(periodosArquivo[i]);
        }
      }

      dataCompleta.push({
        categoria: " Reajuste Contratual",
        periodos: dataArquivo,
      });

      ageAdjustment(ageRangeadjustment);
    }

    function ageAdjustment(ageRangeadjustment) {
      if (ageRangeadjustment.length != 0) {
        for (let i = 0; i < ageRangeadjustment.length; i++) {
          detalhesReajuste.push({});
          periodosReajuste.push({
            periodo: `${ageRangeadjustment[i][0]}`,
            percentualReajuste: `${ageRangeadjustment[i][1]}`.substring(0, 4),
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
    }

    let returnJson = {
      Result: 1,
      Message: "Reajuste de plano",
      Data: dataCompleta,
    };
    return returnJson;
  }
}

export { FormatData };
