
const fs = require("fs");

class FormatDocument {
  async execute(dataTotvs: any) {
    for (let i = 0; i < dataTotvs.Data.length; i++) {
      const element = dataTotvs.Data[i];
      if (
        element.status == "NEGADA" ||
        element.status == "NEGADO" ||
        element.status === "AUTORIZADA PARCIAL"
      ) {
        try {
          const dataPdf = fs.readFileSync(`dist/pdf/${element.guia}.pdf`);
          const base64String = dataPdf.toString("base64");
          element.anexo = {
            nome: "negativa.pdf",
            file64: base64String,
            mimeType: "application/pdf",
          };
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const dataPdf = fs.readFileSync(`dist/pdf/guiaPadrao.pdf`);
          const base64String = dataPdf.toString("base64");
          element.anexo = {
            nome: "arquivo.pdf",
            file64: base64String,
            mimeType: "application/pdf",
          };
        } catch (err) {
          console.log(err);
        }
      }
    }
    return dataTotvs;
  }
}

export { FormatDocument };
