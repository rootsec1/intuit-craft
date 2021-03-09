import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class UpdateUserInputDto {
  @MaxLength(128)
  @MinLength(1)
  name: string;

  @IsEmail()
  email: string;
}
