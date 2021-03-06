import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Product extends Document {
  @Prop({ type: () => String, required: true })
  title: string;

  @Prop({ type: () => Number, required: true })
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
