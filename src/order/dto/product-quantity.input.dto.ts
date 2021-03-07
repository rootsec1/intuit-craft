import { Types } from 'mongoose';

export class ProductQuantityInputDto {
  product: Types.ObjectId;

  quantity: number;
}
