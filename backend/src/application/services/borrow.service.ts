import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Member } from 'src/domain/entities/member.entity';
import { IBookRepository } from 'src/domain/repositories/book.repository';
import { IBorrowRepository } from 'src/domain/repositories/borrow.repository';
import { IMemberRepository } from 'src/domain/repositories/member.repository';

@Injectable()
export class BorrowService {
  private readonly logger = new Logger(BorrowService.name);

  constructor(
    @Inject('IBookRepository')
    private readonly bookRepository: IBookRepository,
    @Inject('IBorrowRepository')
    private readonly borrowRepository: IBorrowRepository,
    @Inject('IMemberRepository')
    private readonly memberRepository: IMemberRepository,
  ) {}

  async borrowBook(memberCode: string, bookCode: string) {
    try {
      this.logger.log(
        `Attempting to borrow book: ${bookCode} by member: ${memberCode}`,
      );

      const member: Member | null =
        await this.memberRepository.findMemberWithBorrowedBooks(memberCode);
      if (!member) {
        this.logger.warn(`Member not found: ${memberCode}`);
        throw new NotFoundException('Member not found.');
      }

      if (member.getBorrowedBooks().length >= 2 || member.hasActivePenalty()) {
        this.logger.warn(`Member ${memberCode} cannot borrow more books.`);
        throw new BadRequestException('Member cannot borrow more books.');
      }

      const book = await this.bookRepository.getBookByCode(bookCode);
      if (!book) {
        this.logger.warn(`Book not found: ${bookCode}`);
        throw new NotFoundException('Book not found.');
      }

      if (book.stockLevel < 1) {
        this.logger.warn(`Book out of stock: ${bookCode}`);
        throw new BadRequestException('Book out of stock.');
      }

      const borrowCode = await this.borrowRepository.generateBorrowCode();
      const borrowedBook = await this.borrowRepository.createBorrowRecord(
        borrowCode,
        memberCode,
        bookCode,
      );

      await this.borrowRepository.decrementBookStock(borrowedBook.bookCode);

      this.logger.log(
        `Book ${bookCode} successfully borrowed by member ${memberCode}`,
      );
      return borrowedBook;
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error; // Preserve expected exceptions
      } else if (error instanceof Error) {
        this.logger.error('Error during book borrowing', error.stack);
      } else {
        this.logger.error('Unknown error during book borrowing');
      }
      throw new InternalServerErrorException(
        'Error processing the borrow request.',
      );
    }
  }

  async returnBook(borrowCode: string) {
    try {
      this.logger.log(
        `Attempting to return book with borrow code: ${borrowCode}`,
      );

      const borrowedBook =
        await this.borrowRepository.findBorrowRecordByCode(borrowCode);
      if (!borrowedBook) {
        this.logger.warn(`Borrow record not found: ${borrowCode}`);
        throw new NotFoundException('Borrow record not found.');
      }

      if (borrowedBook.returnedAt) {
        this.logger.warn(`Book already returned: ${borrowCode}`);
        throw new BadRequestException('Book has already been returned.');
      }

      // Check if the book is overdue (7 days)
      const isOverdue =
        new Date() >
        new Date(borrowedBook.borrowedAt.getTime() + 7 * 24 * 60 * 60 * 1000);

      if (isOverdue) {
        this.logger.log(
          `Member ${borrowedBook.memberCode} penalized for overdue book.`,
        );
        await this.borrowRepository.imposePenalty(borrowedBook.memberCode, 3); // 3 days penalty
      }

      await this.borrowRepository.markBookAsReturned(borrowCode);
      await this.borrowRepository.incrementBookStock(borrowedBook.bookCode);

      this.logger.log(
        `Book with borrow code ${borrowCode} successfully returned`,
      );
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else if (error instanceof Error) {
        this.logger.error('Error during book return', error.stack);
      } else {
        this.logger.error('Unknown error during book return');
      }
      throw new InternalServerErrorException(
        'Error processing the return request.',
      );
    }
  }
}
