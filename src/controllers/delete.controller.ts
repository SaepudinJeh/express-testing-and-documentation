import { NextFunction, Request, Response } from "express";
import createError from 'http-errors';

import { EventModel, IEvent } from "../models/event.model";
import { byIdValidator } from "../validators/byId.validator";

export const deleteEventController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id }: IEvent = await byIdValidator.validateAsync(req.body);

        await EventModel.findByIdAndDelete(_id);

        return res.status(200).json({
            statusCode: 200,
            message: "Deleted Event Successfully"
        }); 
    } catch (error: any) {
        return next(createError(error));
    }
}