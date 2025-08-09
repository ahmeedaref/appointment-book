import { Document, Schema, model, Types } from 'mongoose';
export interface time_Document extends Document {
  providerId: Types.ObjectId;
  specialty: string;
  Date: Date;
  duration: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export const time_Schema = new Schema<time_Document>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
    specialty: { type: String, required: true },
    Date: { type: Date, required: true },
    duration: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const timeSlots = model<time_Document>('timeSlots', time_Schema);
