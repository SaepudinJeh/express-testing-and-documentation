import express, { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import createError, { HttpError } from 'http-errors';

const app: Express = express();

app.use(morgan('dev'));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'wkwkkwkw' });
});

app.use((req: Request, res: Response, next) => {
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

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on PORT ${port}`);
})