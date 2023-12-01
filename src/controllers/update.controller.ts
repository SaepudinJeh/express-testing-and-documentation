import { NextFunction, Request, Response } from "express";
import createError from 'http-errors';

import { updateValidator } from "../validators/update.validator";
import { EventModel, IEvent } from "../models/event.model";

export const updateEventController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id, ...newData }: IEvent = await updateValidator.validateAsync(req.body);

        await EventModel.findByIdAndUpdate(_id, { $set: { ...newData } });

        return res.status(200).json({
            statusCode: 200,
            message: "Updated Event Successfully",
        });
    } catch (error: any) {
        return next(createError(error));
    }
}