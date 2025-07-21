import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";
import { router } from "./routes";
import path from "path";
const app = express();
const host = "192.168.30.26";
const port = 4040;
const http = require("http");

app.use(express.json());
app.use(router);
app.use(cors());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    console.log(err)
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
