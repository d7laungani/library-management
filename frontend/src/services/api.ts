import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  status: 'available' | 'checked_out';
  checkedOutBy: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookTransaction {
  id: number;
  bookId: number;
  book: Book;
  transactionType: 'check_out' | 'check_in';
  userId: string | null;
  dueDate: string | null;
  timestamp: string;
  notes: string | null;
}

export interface CreateBookTransactionDto {
  bookId: number;
  transactionType: 'check_out' | 'check_in';
  userId?: string;
  dueDate?: string;
  notes?: string;
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  description: string;
}

export interface UpdateBookDto extends Partial<CreateBookDto> {}

const api = {
  // Books
  getAllBooks: () => axios.get<Book[]>(`${API_URL}/books`),
  getBook: (id: number) => axios.get<Book>(`${API_URL}/books/${id}`),
  createBook: (book: CreateBookDto) => axios.post<Book>(`${API_URL}/books`, book),
  updateBook: (id: number, book: UpdateBookDto) => axios.patch<Book>(`${API_URL}/books/${id}`, book),
  deleteBook: (id: number) => axios.delete(`${API_URL}/books/${id}`),
  
  // Book Operations
  checkOutBook: (id: number, userId: string, dueDate: Date) => 
    axios.post<Book>(`${API_URL}/books/${id}/check-out`, { userId, dueDate }),
  checkInBook: (id: number) => axios.post<Book>(`${API_URL}/books/${id}/check-in`),
  
  // Reports
  getBookStatus: () => 
    axios.get<{ available: number; checkedOut: number }>(`${API_URL}/books/status/report`),

  // Book Transactions
  getBookTransactions: (bookId: number) => axios.get<BookTransaction[]>(`${API_URL}/books/${bookId}/transactions`),
  createBookTransaction: (transaction: CreateBookTransactionDto) => axios.post<BookTransaction>(`${API_URL}/books/transactions`, transaction),
};

export default api; 