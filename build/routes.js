"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const MountController_1 = require("./controlers/Readjustment/MountController");
const router = (0, express_1.Router)();
exports.router = router;
router.get("/reajuste-plano/reajuste", new MountController_1.ReadjustmentController().handle);
