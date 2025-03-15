import { Book } from '../entities/book.entity';

export interface IBookRepository {
  getAllBooks(): Promise<Book[]>;
  getBookByCode(code: string): Promise<Book | null>;
  createBook(
    code: string,
    title: string,
    author: string,
    stock: number,
  ): Promise<Book>;
  updateBook(
    code: string,
    title: string,
    author: string,
    stock: number,
  ): Promise<Book>;
  deleteBook(code: string): Promise<void>;
  decrementStock(code: string): Promise<void>;
  incrementStock(code: string): Promise<Book>;
}
