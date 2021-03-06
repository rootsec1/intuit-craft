import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from 'src/product/model/product.schema';

export class ProductQuantity {
  @Prop({ type: () => Product, ref: 'Product', required: true })
  product: Types.ObjectId | Product;

  @Prop({ type: () => Number, required: true, min: 1 })
  quantity: number;
}
