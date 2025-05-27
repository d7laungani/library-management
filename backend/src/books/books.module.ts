import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './entities/book.entity';
import { BookTransaction } from './entities/book-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, BookTransaction])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
