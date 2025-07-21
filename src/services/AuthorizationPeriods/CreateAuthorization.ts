import { createWriteStream } from "fs";
import PDFDocument from "pdfkit";
class CreateAuthorization {
  async execute() {
   
      const promises = [];


      const promise = new Promise(async (resolve, reject) => {
        const doc = new PDFDocument({
          fontSize: 12,
          size: "A4",
          margins: {
            top: 30,
            bottom: 30,
            left: 40,
            right: 40,
          },
        });
        const stream = createWriteStream(`src/pdf/guiaPadrao.pdf`);
        doc.pipe(stream);
        doc.image("utils/logo.png", 485, 25, { width: 100 });
        doc.moveDown();
        doc.moveDown();
        doc.text(
            " Impressão disponivel apenas para negativas. ",
            { align: "justify" }
          );
        stream.on("finish", resolve);
        stream.on("error", reject);
        doc.end();
      });

      promises.push(promise);
      
      await Promise.all(promises);
    }
   
}
export { CreateAuthorization };
