import {
  Controller,
  Post,
  Param,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BorrowService } from '../../application/services/borrow.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@ApiTags('borrow')
@Controller()
export class BorrowController {
  private readonly logger = new Logger(BorrowController.name);

  constructor(private readonly borrowService: BorrowService) {}

  @Post('borrow/:memberCode/:bookCode')
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiResponse({ status: 201, description: 'Book borrowed successfully' })
  @ApiResponse({ status: 400, description: 'Book out of stock' })
  @ApiResponse({ status: 404, description: 'Member or Book not found' })
  async borrowBook(
    @Param('memberCode') memberCode: string,
    @Param('bookCode') bookCode: string,
  ) {
    try {
      const borrow = await this.borrowService.borrowBook(memberCode, bookCode);
      return {
        success: true,
        message: 'Book borrowed successfully',
        data: borrow,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to borrow book', error.stack);

        if (error instanceof NotFoundException) {
          throw new HttpException(
            {
              success: false,
              message: error.message || 'Member or Book not found',
            },
            HttpStatus.NOT_FOUND,
          );
        }
        if (error instanceof BadRequestException) {
          throw new HttpException(
            { success: false, message: error.message || 'Book out of stock' },
            HttpStatus.BAD_REQUEST,
          );
        }

        throw new HttpException(
          { success: false, message: error.message || 'Failed to borrow book' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.error('Unknown error borrowing book');
      throw new HttpException(
        { success: false, message: 'Unknown error borrowing book' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('return/:borrowCode')
  @ApiOperation({ summary: 'Return a borrowed book' })
  @ApiResponse({ status: 200, description: 'Book returned successfully' })
  @ApiResponse({ status: 404, description: 'Borrow record not found' })
  async returnBook(@Param('borrowCode') borrowCode: string) {
    try {
      const returnData = await this.borrowService.returnBook(borrowCode);
      return {
        success: true,
        message: 'Book returned successfully',
        data: returnData,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to return book with borrowCode ${borrowCode}`,
          error.stack,
        );

        if (error instanceof NotFoundException) {
          throw new HttpException(
            {
              success: false,
              message: error.message || 'Borrow record not found',
            },
            HttpStatus.NOT_FOUND,
          );
        }

        throw new HttpException(
          { success: false, message: error.message || 'Failed to return book' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.error(
        `Unknown error returning book with borrowCode ${borrowCode}`,
      );
      throw new HttpException(
        { success: false, message: 'Unknown error returning book' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
