import { Document, Schema, model } from 'mongoose';
export interface AuthDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
}

export enum RoleUser {
  provider = 'provider',
  User = 'User',
}

export const AuthSchema = new Schema<AuthDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(RoleUser), default: RoleUser.User },
});

export const Auth = model<AuthDocument>('Auth', AuthSchema);
