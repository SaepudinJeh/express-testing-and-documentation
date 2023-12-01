import { NextFunction, Request, Response } from "express";
import createError from 'http-errors';

import { EventModel, IEvent } from "../models/event.model";
import { byIdValidator } from "../validators/byId.validator";

export const findEventsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await EventModel.find({});

        return res.status(200).json({
            statusCode: 200,
            message: "Get Events Successfully",
            data: events
        });
    } catch (error: any) {
        return next(createError(error));
    }
}

export const findEventController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id }: IEvent = await byIdValidator.validateAsync(req.body);

        const event = await EventModel.findById(_id);

        if(!event) return createError.NotFound('Event not found');

        return res.status(200).json({
            statusCode: 200,
            message: "Get Event Successfully",
            data: event
        });
    } catch (error: any) {
        return next(createError(error));
    }
}