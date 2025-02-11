import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateBookmarkDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
