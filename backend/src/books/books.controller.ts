import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookTransactionDto } from './dto/create-book-transaction.dto';
import { BookTransaction } from './entities/book-transaction.entity';
import { Book } from './entities/book.entity';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({
    status: 201,
    description: 'The book has been successfully created.',
    type: Book,
  })
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'Return all books.', type: [Book] })
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by id' })
  @ApiResponse({ status: 200, description: 'Return the book.', type: Book })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiResponse({
    status: 200,
    description: 'The book has been successfully updated.',
    type: Book,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book' })
  @ApiResponse({
    status: 200,
    description: 'The book has been successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }

  @Post(':id/check-out')
  @ApiOperation({ summary: 'Check out a book' })
  @ApiResponse({ status: 200, description: 'Book checked out successfully' })
  async checkOut(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId') userId: string,
    @Body('dueDate') dueDate: Date,
  ) {
    return this.booksService.checkOut(id, userId, dueDate);
  }

  @Post(':id/check-in')
  @ApiOperation({ summary: 'Check in a book' })
  @ApiResponse({ status: 200, description: 'Book checked in successfully' })
  async checkIn(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.checkIn(id);
  }

  @Get('status/report')
  @ApiOperation({ summary: 'Get book status report' })
  @ApiResponse({ status: 200, description: 'Return the book status report.' })
  getStatus() {
    return this.booksService.getBookStatus();
  }

  @Get(':id/transactions')
  @ApiOperation({ summary: 'Get transaction history for a book' })
  @ApiResponse({ status: 200, type: [BookTransaction] })
  async getTransactionHistory(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.getTransactionHistory(id);
  }

  @Post('transactions')
  @ApiOperation({ summary: 'Create a book transaction' })
  @ApiResponse({ status: 201, type: BookTransaction })
  async createTransaction(@Body() createBookTransactionDto: CreateBookTransactionDto) {
    return this.booksService.createTransaction(createBookTransactionDto);
  }
}
