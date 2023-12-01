import * as dotenv from 'dotenv';
dotenv.config();

import express, { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import createError, { HttpError } from 'http-errors';
import mongoose from 'mongoose';
import routers from './routes';

const app: Express = express();

app.use(morgan('dev'));
app.use(express.json());
routers(app);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: HttpError = createError.NotFound();
  next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const httpError: HttpError = error;
  res.status(httpError.statusCode);
  res.json({
    statusCode: httpError.statusCode,
    message: httpError.message,
  });
});

const port = Number(process.env.PORT ?? 8000);

const MONGO_URI: string = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI).then(() => console.log('Connected to mongodb...'));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on PORT ${port}`);
})