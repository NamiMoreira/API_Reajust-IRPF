"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const host = "192.168.30.26";
const port = 4040;
const http = require("http");
app.use(express_1.default.json());
app.use(routes_1.router);
app.use((0, cors_1.default)());
app.use((err, req, res, next) => {
    if (err instanceof Error) {
        console.log(err);
        return res.status(400).json({
            Result: 0,
            Message: "Ocorreu um erro na execução!",
            Data: []
        });
    }
    return res.status(500).json({
        status: "error",
        message: "Internal server error...",
    });
});
var server = http.createServer(app);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
