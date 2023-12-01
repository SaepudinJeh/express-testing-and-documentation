import { RequestHandler } from "express";
import { createEventController } from "./post.controller";
import { updateEventController } from "./update.controller";
import { findEventController, findEventsController } from "./get.controller";
import { deleteEventController } from './delete.controller';


interface IEventController {
    createEventController: RequestHandler;
    findEventController: RequestHandler;
    findEventsController: RequestHandler;
    updateEventController: RequestHandler;
    deleteEventController: RequestHandler;
}

const eventController: IEventController = {
    createEventController,
    updateEventController,
    findEventController,
    findEventsController,
    deleteEventController
};

export default eventController;