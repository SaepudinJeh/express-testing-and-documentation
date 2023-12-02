import { Express } from "express";

import eventRoute from './event.route';
import emailRoute from './email.route';

export default (app: Express): void => {
  app.use(eventRoute);
  app.use(emailRoute)
};