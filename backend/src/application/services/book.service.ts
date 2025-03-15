import { Inject, Injectable, Logger } from '@nestjs/common';
import { IBookRepository } from '../../domain/repositories/book.repository';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name); // Logger instance for the service

  constructor(
    @Inject('IBookRepository')
    private readonly bookRepository: IBookRepository,
  ) {}

  async getAllBooks() {
    try {
      this.logger.log('Fetching all books'); // Log the start of the operation
      return await this.bookRepository.getAllBooks();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Error retrieving all books', error.stack); // Log the error with stack trace
      } else {
        this.logger.error('Unknown error retrieving all books');
      }
      throw new InternalServerErrorException(
        'Error retrieving books from the repository',
      );
    }
  }

  async getBookByCode(code: string) {
    try {
      this.logger.log(`Fetching book with code: ${code}`);
      const book = await this.bookRepository.getBookByCode(code);
      if (!book) {
        this.logger.warn(`Book with code ${code} not found`); // Warn if book is not found
        throw new NotFoundException('Book not found');
      }
      this.logger.log(`Book with code ${code} found successfully`);
      return book;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Book with code ${code} not found`);
        throw error;
      } else if (error instanceof Error) {
        this.logger.error(
          `Error retrieving book with code ${code}`,
          error.stack,
        );
      } else {
        this.logger.error(`Unknown error retrieving book with code ${code}`);
      }
      throw new InternalServerErrorException(
        'Error retrieving book from the repository',
      );
    }
  }

  async createBook(code: string, title: string, author: string, stock: number) {
    try {
      this.logger.log(`Creating book with code: ${code}`);
      const newBook = await this.bookRepository.createBook(
        code,
        title,
        author,
        stock,
      );
      this.logger.log(`Book with code ${code} created successfully`);
      return newBook;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Error creating book', error.stack);
      } else {
        this.logger.error('Unknown error creating book');
      }
      throw new InternalServerErrorException(
        'Error creating the book in the repository',
      );
    }
  }

  async updateBook(code: string, title: string, author: string, stock: number) {
    try {
      this.logger.log(`Updating book with code: ${code}`);
      const updatedBook = await this.bookRepository.updateBook(
        code,
        title,
        author,
        stock,
      );
      if (!updatedBook) {
        this.logger.warn(`Book with code ${code} not found for update`);
        throw new NotFoundException('Book not found');
      }
      this.logger.log(`Book with code ${code} updated successfully`);
      return updatedBook;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Book with code ${code} not found for update`);
        throw new NotFoundException('Book not found');
      } else if (error instanceof Error) {
        this.logger.error(`Error updating book with code ${code}`, error.stack);
      } else {
        this.logger.error(`Unknown error updating book with code ${code}`);
      }
      throw new InternalServerErrorException(
        'Error updating the book in the repository',
      );
    }
  }

  async deleteBook(code: string) {
    try {
      this.logger.log(`Deleting book with code: ${code}`);
      await this.bookRepository.deleteBook(code);
      this.logger.log(`Book with code ${code} deleted successfully`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error deleting book with code ${code}`, error.stack);
      } else {
        this.logger.error(`Unknown error deleting book with code ${code}`);
      }
      throw new InternalServerErrorException(
        'Error deleting the book from the repository',
      );
    }
  }
}
