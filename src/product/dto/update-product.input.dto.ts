import { MaxLength, Min } from 'class-validator';

export class UpdateProductInputDto {
  @MaxLength(128)
  title: string;

  @Min(1)
  price: number;
}
