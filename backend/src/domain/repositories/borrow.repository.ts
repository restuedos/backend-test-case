import { BorrowedBook, Member, Book } from '@prisma/client';

export interface IBorrowRepository {
  createBorrowRecord(
    borrowCode: string,
    memberCode: string,
    bookCode: string,
  ): Promise<BorrowedBook>;
  decrementBookStock(bookCode: string): Promise<Book>;
  findBorrowRecordByCode(borrowCode: string): Promise<BorrowedBook | null>;
  imposePenalty(memberCode: string, penaltyDays: number): Promise<Member>;
  markBookAsReturned(borrowCode: string): Promise<BorrowedBook>;
  incrementBookStock(bookCode: string): Promise<Book>;
  generateBorrowCode(): Promise<string>;
}
