import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book, BookStatus } from './entities/book.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBook: Book = {
    id: 1,
    title: 'Test Book',
    author: 'Test Author',
    isbn: '978-3-16-148410-0',
    description: 'Test Description',
    status: BookStatus.AVAILABLE,
    checkedOutBy: null,
    dueDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    checkOut: jest.fn(),
    checkIn: jest.fn(),
    getBookStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '978-3-16-148410-0',
        description: 'Test Description',
      };

      mockBooksService.create.mockResolvedValue(mockBook);

      const result = await controller.create(createBookDto);
      expect(result).toEqual(mockBook);
      expect(mockBooksService.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      mockBooksService.findAll.mockResolvedValue([mockBook]);

      const result = await controller.findAll();
      expect(result).toEqual([mockBook]);
      expect(mockBooksService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      mockBooksService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne(1);
      expect(result).toEqual(mockBook);
      expect(mockBooksService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when book is not found', async () => {
      mockBooksService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
      };

      const updatedBook = { ...mockBook, ...updateBookDto };
      mockBooksService.update.mockResolvedValue(updatedBook);

      const result = await controller.update(1, updateBookDto);
      expect(result).toEqual(updatedBook);
      expect(mockBooksService.update).toHaveBeenCalledWith(1, updateBookDto);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      mockBooksService.remove.mockResolvedValue(undefined);

      await controller.remove(1);
      expect(mockBooksService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when book to remove is not found', async () => {
      mockBooksService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkOut', () => {
    it('should check out a book', async () => {
      const userId = 'user123';
      const dueDate = new Date();
      const checkedOutBook = {
        ...mockBook,
        status: BookStatus.CHECKED_OUT,
        checkedOutBy: userId,
        dueDate,
      };

      mockBooksService.checkOut.mockResolvedValue(checkedOutBook);

      const result = await controller.checkOut(1, userId, dueDate);
      expect(result).toEqual(checkedOutBook);
      expect(mockBooksService.checkOut).toHaveBeenCalledWith(1, userId, dueDate);
    });

    it('should throw BadRequestException when book is already checked out', async () => {
      mockBooksService.checkOut.mockRejectedValue(new BadRequestException());

      await expect(
        controller.checkOut(1, 'user123', new Date()),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('checkIn', () => {
    it('should check in a book', async () => {
      const checkedInBook = {
        ...mockBook,
        status: BookStatus.AVAILABLE,
        checkedOutBy: null,
        dueDate: null,
      };

      mockBooksService.checkIn.mockResolvedValue(checkedInBook);

      const result = await controller.checkIn(1);
      expect(result).toEqual(checkedInBook);
      expect(mockBooksService.checkIn).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException when book is already checked in', async () => {
      mockBooksService.checkIn.mockRejectedValue(new BadRequestException());

      await expect(controller.checkIn(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getStatus', () => {
    it('should return book status report', async () => {
      const statusReport = {
        available: 5,
        checkedOut: 3,
      };

      mockBooksService.getBookStatus.mockResolvedValue(statusReport);

      const result = await controller.getStatus();
      expect(result).toEqual(statusReport);
      expect(mockBooksService.getBookStatus).toHaveBeenCalled();
    });
  });
}); 