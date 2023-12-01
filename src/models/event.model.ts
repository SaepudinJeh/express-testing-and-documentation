import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  name: string;
  date: Date;
  startTime: string;
  endTime: string;
}

const eventSchema: Schema<IEvent> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const EventModel = mongoose.model("Event", eventSchema);