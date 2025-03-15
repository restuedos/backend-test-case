import { BorrowedBook } from './borrow.entity';

export class Member {
  private borrowedBooks: BorrowedBook[] = [];

  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string,
    private penaltyUntil?: Date,
  ) {}

  getBorrowedBooks(): BorrowedBook[] {
    return [...this.borrowedBooks]; // Return a copy to prevent direct modification
  }

  hasActivePenalty(): boolean {
    return this.penaltyUntil ? this.penaltyUntil > new Date() : false;
  }

  canBorrow(): boolean {
    return !this.hasActivePenalty();
  }

  borrowBook(book: BorrowedBook): void {
    if (!this.canBorrow()) {
      throw new Error(
        `Member ${this.name} is under penalty and cannot borrow books.`,
      );
    }
    this.borrowedBooks.push(book);
  }

  returnBook(bookCode: string): void {
    const borrowedBook = this.borrowedBooks.find(
      (b) => b.bookCode === bookCode,
    );
    if (!borrowedBook) {
      throw new Error(
        `Book with ID ${bookCode} is not borrowed by ${this.name}.`,
      );
    }
    borrowedBook.returnBook();
  }

  imposePenalty(days: number): void {
    this.penaltyUntil = new Date();
    this.penaltyUntil.setDate(this.penaltyUntil.getDate() + days);
  }
}
