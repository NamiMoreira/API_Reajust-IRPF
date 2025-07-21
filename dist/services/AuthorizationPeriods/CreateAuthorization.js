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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAuthorization = void 0;
const fs_1 = require("fs");
const pdfkit_1 = __importDefault(require("pdfkit"));
class CreateAuthorization {
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            console.log('teste');
            const promise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const doc = new pdfkit_1.default({
                    fontSize: 12,
                    size: "A4",
                    margins: {
                        top: 30,
                        bottom: 30,
                        left: 40,
                        right: 40,
                    },
                });
                const stream = (0, fs_1.createWriteStream)(`src/pdf/guiaPadrao.pdf`);
                doc.pipe(stream);
                doc.image("utils/logo.png", 485, 25, { width: 100 });
                doc.moveDown();
                doc.moveDown();
                doc.text(" Impressão disponivel apenas para negativas. ", { align: "justify" });
                stream.on("finish", resolve);
                stream.on("error", reject);
                doc.end();
            }));
            promises.push(promise);
            yield Promise.all(promises);
        });
    }
}
exports.CreateAuthorization = CreateAuthorization;
