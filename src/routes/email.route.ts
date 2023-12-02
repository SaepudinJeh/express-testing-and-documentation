import { Router } from "express";
import emailController from "../controllers";

const router = Router();

router.post('/send-email', emailController.sendEmailController);
router.post('/enqueue-email', emailController.sendEmaileEnqueueController);

export default router;