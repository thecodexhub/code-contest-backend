import { IsArray, IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateSnippetDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  language: string;

  @IsArray()
  @IsDefined()
  @IsString({ each: true })
  tags: string[];
}
