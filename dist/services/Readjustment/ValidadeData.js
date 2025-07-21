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
exports.ValidadeData = void 0;
const fs_1 = require("fs");
class ValidadeData {
    execute(targetFile) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(__dirname + "/content/" + targetFile + ".json");
            try {
                var uploadedFile = (0, fs_1.readFileSync)('./src/content/' + targetFile + ".json", 'utf8');
                return uploadedFile;
            }
            catch (error) {
                console.log("Atenção!!! \n\n Houve um erro ao carregar : " + targetFile);
            }
        });
    }
}
exports.ValidadeData = ValidadeData;
