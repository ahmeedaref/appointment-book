import { Document, Schema, model, Types } from 'mongoose';
import { time_Document } from 'src/time_slots/schema/schema-time';
export interface appointment_Document extends Document {
  providerId: Types.ObjectId;
  Date: Date;
  duration: string;
  createdBy: time_Document;
  status: string;
  BookedBy: Types.ObjectId | null;
}
export enum App_status {
  Done = 'Done',
  Booked = 'Booked',
  Cancalled = 'Cancalled',
}

export const appointment_Schema = new Schema<appointment_Document>({
  providerId: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
  Date: { type: Date, required: true },
  duration: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'timeSlots', required: true },
  status: {
    type: String,
    enum: Object.values(App_status),
    default: App_status.Booked,
  },
  BookedBy: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
});

export const appointment = model<appointment_Document>(
  'appointment',
  appointment_Schema,
);
