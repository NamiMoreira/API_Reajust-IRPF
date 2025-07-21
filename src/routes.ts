import {Router }  from "express";
import {ReadjustmentController} from './controlers/Readjustment/MountController'
import {AuthorizationPeriods} from './controlers/authorizationPeriods/AuthorizationPeriods'



const router = Router();

router.get("/reajuste-plano/reajuste", new ReadjustmentController().handle)
router.get("/authorizationPeriods", new AuthorizationPeriods().handle)

export {router};
 

