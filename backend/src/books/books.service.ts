import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookStatus } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookTransaction, TransactionType } from './entities/book-transaction.entity';
import { CreateBookTransactionDto } from './dto/create-book-transaction.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(BookTransaction)
    private bookTransactionRepository: Repository<BookTransaction>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    Object.assign(book, updateBookDto);
    return await this.bookRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }

  async checkOut(id: number, userId: string, dueDate: Date): Promise<Book> {
    const book = await this.findOne(id);
    
    if (book.status === BookStatus.CHECKED_OUT) {
      throw new Error('Book is already checked out');
    }

    book.status = BookStatus.CHECKED_OUT;
    book.checkedOutBy = userId;
    book.dueDate = dueDate;

    const transaction = this.bookTransactionRepository.create({
      book,
      bookId: id,
      transactionType: TransactionType.CHECK_OUT,
      userId,
      dueDate,
    });

    await this.bookTransactionRepository.save(transaction);
    return this.bookRepository.save(book);
  }

  async checkIn(id: number): Promise<Book> {
    const book = await this.findOne(id);
    
    if (book.status === BookStatus.AVAILABLE) {
      throw new Error('Book is already checked in');
    }

    const previousUserId = book.checkedOutBy;
    book.status = BookStatus.AVAILABLE;
    book.checkedOutBy = null;
    book.dueDate = null;

    const transaction = this.bookTransactionRepository.create({
      book,
      bookId: id,
      transactionType: TransactionType.CHECK_IN,
      userId: previousUserId,
    });

    await this.bookTransactionRepository.save(transaction);
    return this.bookRepository.save(book);
  }

  async getBookStatus(): Promise<{ available: number; checkedOut: number }> {
    const [available, checkedOut] = await Promise.all([
      this.bookRepository.count({ where: { status: BookStatus.AVAILABLE } }),
      this.bookRepository.count({ where: { status: BookStatus.CHECKED_OUT } }),
    ]);

    return { available, checkedOut };
  }

  async getTransactionHistory(bookId: number): Promise<BookTransaction[]> {
    return this.bookTransactionRepository.find({
      where: { bookId },
      order: { timestamp: 'DESC' },
      relations: ['book'],
    });
  }

  async createTransaction(createBookTransactionDto: CreateBookTransactionDto): Promise<BookTransaction> {
    const book = await this.findOne(createBookTransactionDto.bookId);
    return this.bookTransactionRepository.save(createBookTransactionDto);
  }
}
