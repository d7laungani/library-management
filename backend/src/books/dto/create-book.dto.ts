import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsISBN } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  author: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsISBN()
  isbn: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
