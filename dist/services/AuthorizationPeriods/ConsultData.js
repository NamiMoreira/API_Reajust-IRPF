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
exports.ConsultData = void 0;
class ConsultData {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ authorization, dtInicio, dtFim, card, cpf }) {
            const url = `http://192.168.30.207:31080/api/hat/v1/authorizationPeriods?dtInicio=${dtInicio}&dtFim=${dtFim}`;
            const result = yield fetch(url, {
                method: "GET",
                headers: { "authorization": authorization,
                    "x-carteira": card,
                    "x-cpf": cpf }
            });
            const data = yield result.json();
            console.log(data);
            return data;
        });
    }
}
exports.ConsultData = ConsultData;
