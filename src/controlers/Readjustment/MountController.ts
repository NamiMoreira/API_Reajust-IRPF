import { Request, Response } from "express";
import { ReadjustmentService } from "../../services/Readjustment/ReadjustmentService";
import { ValidadeData } from "../../services/Readjustment/ValidadeData";
const logger = require('../../logs/logger')


class ReadjustmentController {
  async handle(req: Request, res: Response) {
    const { authorization } = req.headers;
    const unidade = req.headers["x-coopid"];
    const card = req.headers["x-carteira"];

    if (authorization == "" || card == "" || unidade != "57") {
      const validadeData = new ValidadeData();
      const validate = await validadeData.execute("notFound");
      return res.end(validate);
    }
    var moment = new Date();
    logger.debug(
      "________________ " +
        moment + "________________ " +
        card + "________________ " 
    );
    const readjustmentService = new ReadjustmentService();
    const readjustment = await readjustmentService.execute({
      authorization,
      card,
      unidade,
    });

    return res.end(readjustment);
  }
}
export { ReadjustmentController };
