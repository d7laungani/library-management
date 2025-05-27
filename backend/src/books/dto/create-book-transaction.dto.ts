import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsDate } from 'class-validator';
import { TransactionType } from '../entities/book-transaction.entity';
import { Type } from 'class-transformer';

export class CreateBookTransactionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  bookId: number;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  transactionType: TransactionType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
} 