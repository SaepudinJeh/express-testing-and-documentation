import { RequestHandler } from "express";
import { createEventController } from "./post.controller";
import { updateEventController } from "./update.controller";
import { findEventController, findEventsController } from "./get.controller";
import { deleteEventController } from './delete.controller';
import { sendEmailController, sendEmaileEnqueueController } from './email.controller';


interface IEventController {
    createEventController: RequestHandler;
    findEventController: RequestHandler;
    findEventsController: RequestHandler;
    updateEventController: RequestHandler;
    deleteEventController: RequestHandler;

    // Email controller
    sendEmailController: RequestHandler;
    sendEmaileEnqueueController: RequestHandler;
}

const eventController: IEventController = {
    createEventController,
    updateEventController,
    findEventController,
    findEventsController,
    deleteEventController,
    sendEmailController,
    sendEmaileEnqueueController
};

export default eventController;