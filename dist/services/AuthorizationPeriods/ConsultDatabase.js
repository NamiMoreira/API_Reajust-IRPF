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
exports.ConsultDatabase = void 0;
const fs_1 = require("fs");
const oracledb_1 = require("oracledb");
class ConsultDatabase {
    execute(ano, guia) {
        return __awaiter(this, void 0, void 0, function* () {
            let select = (0, fs_1.readFileSync)("./src/content/selectAutorization.txt", "utf-8").toString();
            select = select.replace("&ano", ano);
            select = select.replace("&guia", guia);
            const clientOpts = { libDir: "C:/oracle/instantclient_11_2" };
            const config = {
                user: "srcadger",
                password: "srcadger",
                connectString: "192.168.10.2:1521/TASYPRINC",
            };
            try {
                (0, oracledb_1.initOracleClient)(clientOpts);
            }
            catch (err) {
                console.error(err);
                process.exit(1);
            }
            var valueSelect = yield returnAutorization();
            function returnAutorization() {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const connection = yield (0, oracledb_1.getConnection)(config);
                        const result = yield connection.execute(select);
                        doRelease(connection);
                        return result.rows;
                    }
                    catch (e) {
                        console.log(e);
                    }
                });
            }
            function doRelease(connection) {
                connection.close(function (err) {
                    if (err)
                        console.error(err.message);
                });
            }
            return valueSelect;
        });
    }
}
exports.ConsultDatabase = ConsultDatabase;
