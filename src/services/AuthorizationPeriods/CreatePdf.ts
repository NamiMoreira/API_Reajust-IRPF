import PDFDocument from "pdfkit";
import { createWriteStream, readFileSync } from "fs";
import path from "path";
import { ConsultDatabase } from "./ConsultDatabase";
import { error } from "console";

class CreatePdf {
  async execute(dataTotvs: any, cpf) {
    const promises = [];
    const consultDatabase = new ConsultDatabase();

    for (let i = 0; i < dataTotvs.Data.length; i++) {
      const element = dataTotvs.Data[i];
      const promise = new Promise(async (resolve, reject) => {
        let ano = parseInt(element.guia.slice(0, 4));
        let guia = parseInt(element.guia.slice(4));

   
          const data = await consultDatabase.execute(ano, guia);
            console.log(data[0][0]);
            

          if (!data?.[0]) {
            return reject(new Error("Dados da guia não encontrados"));
          }

          let nome;
          if (!data?.[1]) {
          let  nome = data[0][6];
          } else {
            nome = data[1][6];
          }
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
          const stream = createWriteStream(`dist/pdf/${element.guia}.pdf`);
          doc.pipe(stream);
          doc.image("utils/logo.png", 485, 25, { width: 100 });
          doc.moveDown();
          doc.moveDown();
          doc.rect(30, 160, 365, 35).stroke(); //nome
          doc.rect(395, 160, 175, 35).stroke(); //data nascimento
          doc.rect(30, 195, 235, 35).stroke(); //codigo identificacao
          doc.rect(395, 195, 175, 35).stroke(); //data adesao
          doc.rect(30, 230, 265, 35).stroke(); //abrangecia
          doc.rect(295, 230, 275, 35).stroke(); //acomodacao
          doc.rect(30, 265, 540, 20).stroke(); //nr protocolo
          doc.font("Times-Bold");
          doc.text("COMPROVANTE DE NEGATIVA CONTRATUAL/ ASSISTENCIAL", {
            align: "center",
          });
          doc.font("Times-Roman");
          doc.moveDown();
          doc.text(
            "A Unimed Pindamonhangaba Cooperativa de Trabalho Médico, operadora de planos de assistência privada a saúde, registrada na ANS sob o nº 342343, inscrita no CNPJ/MF sob o nº 47565155/0001-39, com sede a Rua Alcides Ramos Nogueira nº 650, Bairro: Mombaça, CEP: 12421-705 informa acerca de sua solicitação médica: ",
            { align: "justify" }
          );

          doc.font("Times-Bold");
          doc.text("INFORMAÇÕES DE ACORDO COM DISPOSITIVO LEGAL", {
            align: "center",
          });
          doc.moveDown();
          doc.text("Nome Beneficiário: ", 40, 165);
          doc.text("Data de nascimento:", 400, 165);
          doc.text("Codigo de identificação:", 40, 200);
          doc.text("CPF", 270, 200);
          doc.text("Data de adesão:", 400, 200);
          doc.text("Abrangencia:", 40, 235);
          doc.text("Acomodação:", 300, 235);
          doc.text("Número da Guia: ", 40, 270);
          doc.font("Times-Roman");
          doc.moveDown();

          doc.text(nome, 40, 180); //nome
          doc.text(data[0][1], 405, 180); //dt nascimento
          doc.text(data[0][3], 405, 215); //data adesao
          doc.text(data[0][2], 275, 215); //cpf
          doc.text(data[0][0], 40, 215); //CODIGO IDENTIFICACAO
          doc.text(data[0][5], 300, 250); //acomodacao

          doc.text(element.guia, 155, 270); //guia
          doc.text(data[0][7], 40, 250); //abrangencia
          doc.moveDown();
           doc.text(
            "Atendendo a Resolução Normativa n°395/16 é possível requerer a reanalise de sua solicitação à Ouvidoria da Unimed Pinda no prazo máximo de 48h do recebimento deste documento. A reanálise deve ser solicitada através do site  https://www.unimed.coop.br/site/pt/web/pindamonhangaba/ouvidoria_unimed_pinda, ou no telefone 0800 057 00 00 – Ligação gratuita 24hs.  Informamos que sua solicitação médica, referente ao procedimento citado abaixo, não foi autorizada com base nas justificativas: ",
            40,290,
          
          {align: "justify"});

          for (let i = 0; i < element.procedimentos.length; i++) {
            const data = element.procedimentos[i];
            if (data.status == "NEGADO" || data.status == "NEGADA") {
              doc.moveDown();
              doc.rect(doc.x, doc.y - 5, 530, 0).stroke(); //
              doc.font("Times-Bold");
              doc.fontSize(10);
              doc.text(
                ` ${data.codigo}  ${data.nome} (Qtde : ${data.qtdSolicitada})`
              );

              doc.text("Motivo da negativa:", 40);
              doc.font("Times-Roman");
              if (!element.motivoNegativa) {
                doc.text(data.motivoNegativa);
              } else {
                doc.text(element.motivoNegativa);
              }
            }
          }
          doc.rect(doc.x, doc.y + 5, 530,0).stroke();
          stream.on("finish", resolve);
          stream.on("error", reject);
          doc.end();
 
      });

      promises.push(promise);
    }

    await Promise.all(promises);
  }
}

export { CreatePdf };
