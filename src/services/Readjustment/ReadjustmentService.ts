import { ValidadeData } from "./ValidadeData";
import { ConsultDatabase } from "./ConsultDatabase";
import { FormatData } from "./FormatData";

const logger = require('../../logs/logger')

class ReadjustmentService {
  async execute({ authorization, card, unidade }) {
    

    var moment = new Date();
    const modalidade = card.substring(4, 6);
    const contrato = card.substring(6, 11);
    const URL =
      "http://192.168.30.207:31080/dts/datasul-rest/resources/prg/hvp/v1/proposals/" +
      modalidade +
      "/" +
      contrato +
      "/contractHistoricalAdjustments";
    const validadeData = new ValidadeData();
    const consultDatabase = new ConsultDatabase();
    const formatData = new FormatData();

    let response = await fetch(URL, {
      method: "GET",
      headers: { Authorization: authorization },
    });
    let data = await response.json();

    if (response.status < 200 || response.status > 299) {
      const validate = await validadeData.execute("error");

      return validate;
    } else {
      const ageRangeadjustment = await consultDatabase.execute(card);

      //Contratos que são do tipo empresarial
      let contratos = [45, 30, 31, 40, 60, 61, 65, 67, 70, 75, 80, 85, 86, 99];
      let contractual = false;
      
      for (let i = 0; i < contratos.length; i++) {
     
        if (contratos[i] == modalidade) {
            contractual = true;     
          break;
        }
      }
      
        const dataAdjustment = await formatData.execute(
          data,
          ageRangeadjustment,
          contractual
        );

        return JSON.stringify(dataAdjustment)
     

    }
  }
}

export { ReadjustmentService };
