import { Book } from './book.entity';
import { Member } from './member.entity';

export class BorrowedBook {
  private member: Member;
  private book: Book;

  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly memberCode: string,
    public readonly bookCode: string,
    public readonly borrowedAt: Date,
    private returnedAt?: Date,
  ) {}

  getMember(): Member {
    return this.member;
  }

  getBook(): Book {
    return this.book;
  }

  returnBook(): void {
    if (this.returnedAt) {
      throw new Error('Book is already returned');
    }
    this.returnedAt = new Date();
  }

  isReturned(): boolean {
    return this.returnedAt !== undefined;
  }

  getReturnedAt(): Date | null {
    return this.returnedAt ?? null;
  }
}
