import { Express } from "express";

import eventRoute from './event.route';

export default (app: Express): void => {
  app.use(eventRoute);
};