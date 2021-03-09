import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserInputDto {
  @MaxLength(128)
  @MinLength(1)
  name: string;

  @IsEmail()
  email: string;

  @MaxLength(128)
  @MinLength(4)
  password: string;
}
