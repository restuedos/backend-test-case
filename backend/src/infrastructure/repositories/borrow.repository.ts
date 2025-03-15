import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IBorrowRepository } from 'src/domain/repositories/borrow.repository';
import { BorrowedBook, Member, Book } from '@prisma/client';

@Injectable()
export class BorrowRepository implements IBorrowRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBorrowRecord(
    borrowCode: string,
    memberCode: string,
    bookCode: string,
  ): Promise<BorrowedBook> {
    try {
      return await this.prisma.borrowedBook.create({
        data: { code: borrowCode, memberCode, bookCode },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error creating borrow record: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown error creating borrow record',
      );
    }
  }

  async decrementBookStock(bookCode: string): Promise<Book> {
    try {
      return await this.prisma.book.update({
        where: { code: bookCode },
        data: { stock: { decrement: 1 } },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error decrementing book stock: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown error decrementing book stock',
      );
    }
  }

  async findBorrowRecordByCode(
    borrowCode: string,
  ): Promise<BorrowedBook | null> {
    try {
      const borrowRecord = await this.prisma.borrowedBook.findUnique({
        where: { code: borrowCode },
        include: { member: true },
      });

      if (!borrowRecord) {
        throw new NotFoundException('Borrow record not found');
      }

      return borrowRecord;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error finding borrow record: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown error finding borrow record',
      );
    }
  }

  async imposePenalty(
    memberCode: string,
    penaltyDays: number,
  ): Promise<Member> {
    try {
      return await this.prisma.member.update({
        where: { code: memberCode },
        data: {
          penaltyUntil: new Date(
            Date.now() + penaltyDays * 24 * 60 * 60 * 1000,
          ),
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error imposing penalty: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Unknown error imposing penalty');
    }
  }

  async markBookAsReturned(borrowCode: string): Promise<BorrowedBook> {
    try {
      return await this.prisma.borrowedBook.update({
        where: { code: borrowCode },
        data: { returnedAt: new Date() },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error marking book as returned: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown error marking book as returned',
      );
    }
  }

  async incrementBookStock(bookCode: string): Promise<Book> {
    try {
      return await this.prisma.book.update({
        where: { code: bookCode },
        data: { stock: { increment: 1 } },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error incrementing book stock: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown error incrementing book stock',
      );
    }
  }

  async generateBorrowCode(): Promise<string> {
    try {
      const lastBorrow = await this.prisma.borrowedBook.findFirst({
        orderBy: { code: 'desc' },
      });

      let newBorrowCode = 'BW001';

      if (lastBorrow && lastBorrow.code) {
        const lastNumber = parseInt(lastBorrow.code.substring(2), 10);
        const nextNumber = lastNumber + 1;
        newBorrowCode = `BW${nextNumber.toString().padStart(3, '0')}`;
      }

      return newBorrowCode;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error generating borrow code: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown error generating borrow code',
      );
    }
  }
}
