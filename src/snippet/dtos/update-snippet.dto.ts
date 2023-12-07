import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSnippetDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  code: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  language: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];
}
