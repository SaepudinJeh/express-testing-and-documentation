import { NextFunction, Request, Response } from "express";
import createError from 'http-errors';
import nodemailer from 'nodemailer';
import { setupRabbitMQ } from "../utils/rabbitMq.util";

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'kendall.grimes@ethereal.email',
        pass: '2WcQTESVc2mGktHuws'
    }
});


export const sendEmailController = async (req: Request, res: Response, next: NextFunction) => {
    const { to, subject, text } = req.body;
    try {
        await transporter.sendMail({
            from: 'kendall.grimes@ethereal.email',
            to,
            subject,
            text,
            html: "<b>Hello world?</b>"
        });

        res.status(200).json({ statusCode: 200, success: true, message: 'Email sent successfully' });
    } catch (error: any) {
        return next(createError(error));
    }
}

export const sendEmaileEnqueueController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { to, subject, text } = req.body;
        const channel = await setupRabbitMQ();

        const QUEUE_NAME: string = process.env.QUEUE_NAME || '';

        // Enqueue the email task
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({ to, subject, text })), { persistent: true });

        res.status(200).json({ success: true, message: 'Email task enqueued successfully' });
    } catch (error: any) {
        return next(createError(error));
    }
}