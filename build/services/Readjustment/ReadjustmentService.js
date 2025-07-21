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
exports.ReadjustmentService = void 0;
const ValidadeData_1 = require("./ValidadeData");
const ConsultDatabase_1 = require("./ConsultDatabase");
const FormatData_1 = require("./FormatData");
class ReadjustmentService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ authorization, card, unidade }) {
            var moment = new Date();
            console.log("execute: /n" + card + '/n' + moment);
            const modalidade = card.substring(4, 6);
            const contrato = card.substring(6, 11);
            const URL = "http://192.168.30.207:31080/dts/datasul-rest/resources/prg/hvp/v1/proposals/" +
                modalidade +
                "/" +
                contrato +
                "/contractHistoricalAdjustments";
            const validadeData = new ValidadeData_1.ValidadeData();
            const consultDatabase = new ConsultDatabase_1.ConsultDatabase();
            const formatData = new FormatData_1.FormatData();
            let response = yield fetch(URL, {
                method: "GET",
                headers: { Authorization: authorization },
            });
            let data = yield response.json();
            if (response.status < 200 || response.status > 299) {
                const validate = yield validadeData.execute("error");
                return validate;
            }
            else {
                const ageRangeadjustment = yield consultDatabase.execute(card);
                //Contratos que são do tipo empresarial
                let contratos = [45, 30, 31, 40, 60, 61, 65, 67, 70, 75, 80, 85, 86, 99];
                let contractual = false;
                for (let i = 0; i < contratos.length; i++) {
                    if (contratos[i] == modalidade) {
                        console.log(contratos[i]);
                        contractual = true;
                        break;
                    }
                }
                const dataAdjustment = yield formatData.execute(data, ageRangeadjustment, contractual);
                return JSON.stringify(dataAdjustment);
            }
        });
    }
}
exports.ReadjustmentService = ReadjustmentService;
