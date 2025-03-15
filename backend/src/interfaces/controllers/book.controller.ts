import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BookService } from '../../application/services/book.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBookDto, UpdateBookDto } from '../dtos/book.dto';
import { NotFoundException } from '@nestjs/common';

@ApiTags('books')
@Controller('books')
export class BookController {
  private readonly logger = new Logger(BookController.name);

  constructor(private readonly bookService: BookService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List of all books' })
  async getAllBooks() {
    try {
      const books = await this.bookService.getAllBooks();
      return {
        success: true,
        message: 'Books retrieved successfully',
        data: books,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to retrieve books', error.stack);
        throw new HttpException(
          {
            success: false,
            message: error.message || 'Failed to retrieve books',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      this.logger.error('Unknown error retrieving books');
      throw new HttpException(
        { success: false, message: 'Unknown error retrieving books' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':code')
  @ApiResponse({ status: 200, description: 'Get book by Code' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async getBookByCode(@Param('code') code: string) {
    try {
      const book = await this.bookService.getBookByCode(code);
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      return {
        success: true,
        message: 'Book retrieved successfully',
        data: book,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to retrieve book with code ${code}`,
          error.stack,
        );
        if (error instanceof NotFoundException) {
          throw new HttpException(
            { success: false, message: error.message || 'Book not found' },
            HttpStatus.NOT_FOUND,
          );
        }
        throw new HttpException(
          {
            success: false,
            message: error.message || 'Failed to retrieve book',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      this.logger.error(`Unknown error retrieving book with code ${code}`);
      throw new HttpException(
        { success: false, message: 'Unknown error retrieving book' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Book created successfully' })
  async createBook(@Body() createBookDto: CreateBookDto) {
    try {
      const newBook = await this.bookService.createBook(
        createBookDto.code,
        createBookDto.title,
        createBookDto.author,
        createBookDto.stock,
      );
      return {
        success: true,
        message: 'Book created successfully',
        data: newBook,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to create book', error.stack);
        throw new HttpException(
          { success: false, message: error.message || 'Failed to create book' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      this.logger.error('Unknown error creating book');
      throw new HttpException(
        { success: false, message: 'Unknown error creating book' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':code')
  @ApiResponse({ status: 200, description: 'Book updated successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async updateBook(
    @Param('code') code: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    try {
      const updatedBook = await this.bookService.updateBook(
        code,
        updateBookDto.title,
        updateBookDto.author,
        updateBookDto.stock,
      );
      if (!updatedBook) {
        throw new NotFoundException('Book not found');
      }
      return {
        success: true,
        message: 'Book updated successfully',
        data: updatedBook,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to update book with code ${code}`,
          error.stack,
        );
        if (error instanceof NotFoundException) {
          throw new HttpException(
            { success: false, message: error.message || 'Book not found' },
            HttpStatus.NOT_FOUND,
          );
        }
        throw new HttpException(
          { success: false, message: error.message || 'Failed to update book' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      this.logger.error(`Unknown error updating book with code ${code}`);
      throw new HttpException(
        { success: false, message: 'Unknown error updating book' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':code')
  @ApiResponse({ status: 200, description: 'Book deleted successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async deleteBook(@Param('code') code: string) {
    try {
      await this.bookService.deleteBook(code);
      return {
        success: true,
        message: 'Book deleted successfully',
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to delete book with code ${code}`,
          error.stack,
        );
        throw new HttpException(
          { success: false, message: error.message || 'Failed to delete book' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      this.logger.error(`Unknown error deleting book with code ${code}`);
      throw new HttpException(
        { success: false, message: 'Unknown error deleting book' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
