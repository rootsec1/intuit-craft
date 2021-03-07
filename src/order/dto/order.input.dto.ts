import { Types } from 'mongoose';
import { ProductQuantityInputDto } from './product-quantity.input.dto';

export class OrderInputDto {
  user: Types.ObjectId;

  products: ProductQuantityInputDto[];
}
