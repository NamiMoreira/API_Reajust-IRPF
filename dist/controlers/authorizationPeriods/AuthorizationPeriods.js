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
exports.AuthorizationPeriods = void 0;
const ConsultData_1 = require("../../services/AuthorizationPeriods/ConsultData");
const CreatePdf_1 = require("../../services/AuthorizationPeriods/CreatePdf");
const FormatDocument_1 = require("../../services/AuthorizationPeriods/FormatDocument");
const CreateAuthorization_1 = require("../../services/AuthorizationPeriods/CreateAuthorization");
class AuthorizationPeriods {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dtInicio, dtFim } = req.query;
            const { authorization } = req.headers;
            const card = req.headers["x-carteira"];
            const cpf = req.headers["x-cpf"];
            const consultData = new ConsultData_1.ConsultData();
            const createPdf = new CreatePdf_1.CreatePdf();
            const formatDocument = new FormatDocument_1.FormatDocument();
            const createAuthorization = new CreateAuthorization_1.CreateAuthorization();
            const dataTotvs = yield consultData.execute({
                authorization,
                dtInicio,
                dtFim,
                card,
                cpf,
            });
            const denied = dataTotvs.Data.find((d) => d.status === "NEGADA" ||
                d.status === "NEGADO" ||
                d.status === "AUTORIZADA PARCIAL");
            if (denied) {
                console.log('teste');
                const pdf = yield createPdf.execute(dataTotvs, cpf);
                const PDF = yield createAuthorization.execute();
                const result = yield formatDocument.execute(dataTotvs);
                // dataTotvs.Data.map((data) => {
                //  unlink(`./src/pdf/${data.guia}.pdf`, (err) => {
                //   if (err) {
                //     console.error(`Erro ao excluir o diretório: ${err}`);
                //   }
                // });
                // });
                return res.json(result);
            }
            else {
                return res.json(dataTotvs);
            }
        });
    }
}
exports.AuthorizationPeriods = AuthorizationPeriods;
