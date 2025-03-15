import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IBookRepository } from '../../domain/repositories/book.repository';
import { Book } from '../../domain/entities/book.entity';

@Injectable()
export class BookRepository implements IBookRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllBooks(): Promise<Book[]> {
    try {
      const prismaBooks = await this.prisma.book.findMany();
      return prismaBooks.map(
        (prismaBook) =>
          new Book(
            prismaBook.id,
            prismaBook.code,
            prismaBook.title,
            prismaBook.author,
            prismaBook.stock,
          ),
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error fetching all books: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown error fetching all books',
      );
    }
  }

  async getBookByCode(code: string): Promise<Book | null> {
    try {
      const prismaBook = await this.prisma.book.findUnique({ where: { code } });
      if (!prismaBook) {
        throw new NotFoundException('Book not found');
      }
      return new Book(
        prismaBook.id,
        prismaBook.code,
        prismaBook.title,
        prismaBook.author,
        prismaBook.stock,
      );
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error; // Propagate NotFoundException
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error fetching book by code: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown error fetching book by code',
      );
    }
  }

  async createBook(
    code: string,
    title: string,
    author: string,
    stock: number,
  ): Promise<Book> {
    try {
      const prismaBook = await this.prisma.book.create({
        data: { code, title, author, stock },
      });
      return new Book(
        prismaBook.id,
        prismaBook.code,
        prismaBook.title,
        prismaBook.author,
        prismaBook.stock,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error creating book: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Unknown error creating book');
    }
  }

  async updateBook(
    code: string,
    title: string,
    author: string,
    stock: number,
  ): Promise<Book> {
    try {
      const prismaBook = await this.prisma.book.update({
        where: { code },
        data: { title, author, stock },
      });
      return new Book(
        prismaBook.id,
        prismaBook.code,
        prismaBook.title,
        prismaBook.author,
        prismaBook.stock,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error updating book: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Unknown error updating book');
    }
  }

  async deleteBook(code: string): Promise<void> {
    try {
      await this.prisma.book.delete({ where: { code } });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error deleting book: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Unknown error deleting book');
    }
  }

  async decrementStock(code: string): Promise<void> {
    try {
      await this.prisma.book.update({
        where: { code },
        data: { stock: { decrement: 1 } },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error decrementing stock: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown error decrementing stock',
      );
    }
  }

  async incrementStock(code: string): Promise<Book> {
    try {
      const prismaBook = await this.prisma.book.update({
        where: { code },
        data: { stock: { increment: 1 } },
      });
      return new Book(
        prismaBook.id,
        prismaBook.code,
        prismaBook.title,
        prismaBook.author,
        prismaBook.stock,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error incrementing stock: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown error incrementing stock',
      );
    }
  }
}
