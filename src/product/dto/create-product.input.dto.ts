import { MaxLength, Min } from 'class-validator';

export class CreateProductInputDto {
  @MaxLength(128)
  title: string;

  @Min(1)
  price: number;
}
