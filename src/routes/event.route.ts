import { Router } from "express";
import eventController from "../controllers";

const router = Router();

router.post("/event", eventController.createEventController);
router.get("/events", eventController.findEventsController);
router.get("/event", eventController.findEventController);
router.put("/event", eventController.updateEventController);
router.delete("/event", eventController.deleteEventController);

export default router;
