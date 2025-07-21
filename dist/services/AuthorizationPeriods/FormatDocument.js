"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDocument = void 0;
const fs = require("fs");
class FormatDocument {
    execute(dataTotvs) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < dataTotvs.Data.length; i++) {
                const element = dataTotvs.Data[i];
                if (element.status == "NEGADA" ||
                    element.status == "NEGADO" ||
                    element.status === "AUTORIZADA PARCIAL") {
                    try {
                        const dataPdf = fs.readFileSync(`dist/pdf/${element.guia}.pdf`);
                        const base64String = dataPdf.toString("base64");
                        element.anexo = {
                            nome: "negativa.pdf",
                            file64: base64String,
                            mimeType: "application/pdf",
                        };
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
                else {
                    try {
                        const dataPdf = fs.readFileSync(`dist/pdf/guiaPadrao.pdf`);
                        const base64String = dataPdf.toString("base64");
                        element.anexo = {
                            nome: "arquivo.pdf",
                            file64: base64String,
                            mimeType: "application/pdf",
                        };
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
            }
            return dataTotvs;
        });
    }
}
exports.FormatDocument = FormatDocument;
