import { ProductQuantityInputDto } from './product-quantity.input.dto';

export class OrderInputDto {
  user: string;

  products: ProductQuantityInputDto[];
}
