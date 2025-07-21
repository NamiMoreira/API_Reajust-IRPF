import { Response, Request } from "express";
import { ConsultData } from "../../services/AuthorizationPeriods/ConsultData";
import { CreatePdf } from "../../services/AuthorizationPeriods/CreatePdf";
import { FormatDocument } from "../../services/AuthorizationPeriods/FormatDocument";
import { unlink } from "fs";
import { CreateAuthorization } from "../../services/AuthorizationPeriods/CreateAuthorization";

class AuthorizationPeriods {
  async handle(req: Request, res: Response) {
    const { dtInicio, dtFim } = req.query;
    const { authorization } = req.headers;
    const card = req.headers["x-carteira"];
    const cpf = req.headers["x-cpf"];

    const consultData = new ConsultData();
    const createPdf = new CreatePdf();
    const formatDocument = new FormatDocument();
    const createAuthorization = new CreateAuthorization();

    const dataTotvs = await consultData.execute({
      authorization,
      dtInicio,
      dtFim,
      card,
      cpf,
    });
    const denied = dataTotvs.Data.find(
      (d) =>
        d.status === "NEGADA" ||
        d.status === "NEGADO" ||
        d.status === "AUTORIZADA PARCIAL"
    );

    if (denied) {
      
      const pdf = await createPdf.execute(dataTotvs, cpf);
      const PDF = await createAuthorization.execute()
      const result = await formatDocument.execute(dataTotvs);
     
      

     // dataTotvs.Data.map((data) => {
      //  unlink(`./src/pdf/${data.guia}.pdf`, (err) => {
       //   if (err) {
       //     console.error(`Erro ao excluir o diretório: ${err}`);
       //   }
       // });
     // });
      

      return res.json(result);
    } else {
      return res.json(dataTotvs);
    }
  }
}

export { AuthorizationPeriods };
