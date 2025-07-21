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
exports.ReadjustmentController = void 0;
const ReadjustmentService_1 = require("../../services/Readjustment/ReadjustmentService");
const ValidadeData_1 = require("../../services/Readjustment/ValidadeData");
class ReadjustmentController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            const unidade = req.headers["x-coopid"];
            const card = req.headers["x-carteira"];
            if (authorization == "" || card == "" || unidade != "57") {
                const validadeData = new ValidadeData_1.ValidadeData();
                const validate = yield validadeData.execute("notFound");
                return res.end(validate);
            }
            const readjustmentService = new ReadjustmentService_1.ReadjustmentService();
            const readjustment = yield readjustmentService.execute({
                authorization,
                card,
                unidade,
            });
            return res.end(readjustment);
        });
    }
}
exports.ReadjustmentController = ReadjustmentController;
