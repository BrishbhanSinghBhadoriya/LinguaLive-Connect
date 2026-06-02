import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import translationRouter from "./translation";

const router: IRouter = Router();

router.use("/health", healthRouter);
router.use("/contact", contactRouter);
router.use("/translate", translationRouter);

export default router;
