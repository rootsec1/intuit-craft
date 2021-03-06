import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  @Prop({ type: () => String, required: true })
  name: string;

  @Prop({ type: () => String, required: true, unique: true })
  email: string;

  @Prop({ type: () => String, required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
