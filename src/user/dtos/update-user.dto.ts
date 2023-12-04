import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;
}
