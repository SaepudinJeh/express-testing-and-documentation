import { NextFunction, Request, Response } from "express";
import createError from 'http-errors';

import { postValidator } from "../validators/post.validator";
import { EventModel } from "../models/event.model";

export const createEventController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postValidation = await postValidator.validateAsync(req.body);
    
        await EventModel.create(postValidation);

        return res.status(201).json({
            statusCode: 201,
            message: "Created Event Successfully",
        });
    } catch (error: any) {
        return next(createError(error));
    }
}