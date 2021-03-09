import { Min } from 'class-validator';
import { Types } from 'mongoose';

export class ProductQuantityInputDto {
  product: Types.ObjectId;

  @Min(1)
  quantity: number;
}
