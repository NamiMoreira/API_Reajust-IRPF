//const
const express = require("express");
const fs = require("fs");
const app = express();
const http = require("http");
const host = "localhost";
const port = 4040;
const pdf2base64 = require("pdf-to-base64");
const fc              = require('./funcoes');
const ex              = require('./execPDF');
const exj             = require('./execReaj');
const consultReajuste = fc.geraSelect()
const notFound        = fc.carregaVariavel("notFound");
const range           = fc.carregaVariavel("range");
const coletEmpres     = fc.carregaVariavel("coletEmpres");
const notFoundBenef   = fc.carregaVariavel("notFoundBenef");
const varError        = fc.carregaVariavel("varError");
const contractEmpre   = fc.carregaVariavel("contractEmpre");
const homologa        = fc.carregaVariavel("homologacao")


app.get("/reajuste", function (req, res, next) {
  console.log("execução");
  exj.execReaj(fc,req,notFound,res,range,contractEmpre,consultReajuste,varError)
});

app.get("/IRPFPDF", async function (req, res, next) {
  console.log("execução");
  ex.executaPDF(fc,req,notFound,res,homologa,notFoundBenef)
})

var server = http.createServer(app);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});




