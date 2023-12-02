import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class SigninUserDto {
  @IsString()
  @IsNotEmpty()
  @ValidateIf((_object, value) => value !== undefined)
  username: string;

  @IsEmail()
  @ValidateIf((object) => object.username === undefined)
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
