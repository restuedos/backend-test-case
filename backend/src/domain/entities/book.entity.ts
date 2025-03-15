import { BadRequestException } from '@nestjs/common';
import { BorrowedBook } from './borrow.entity';

export class Book {
  private borrowedBooks: BorrowedBook[] = [];

  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly title: string,
    public readonly author: string,
    private stock: number,
  ) {}

  get stockLevel(): number {
    return this.stock;
  }

  getBorrowedBooks(): BorrowedBook[] {
    return [...this.borrowedBooks]; // Return a copy to prevent direct modification
  }

  getStock(): number {
    return this.stock;
  }

  incrementStock(amount: number = 1): void {
    if (amount < 1) throw new Error('Cannot increment stock by less than 1');
    this.stock += amount;
  }

  decrementStock(amount: number = 1): void {
    if (amount < 1) throw new Error('Cannot decrement stock by less than 1');
    if (this.stock < amount) throw new Error('Not enough stock');
    this.stock -= amount;
  }

  isAvailable(): boolean {
    return this.stock > 0;
  }

  borrow(): void {
    if (!this.isAvailable()) {
      throw new BadRequestException('Book is out of stock');
    }
    this.decrementStock();
  }

  returnBook(): void {
    this.incrementStock();
  }

  toPlainObject() {
    return {
      id: this.id,
      code: this.code,
      title: this.title,
      author: this.author,
      stock: this.stockLevel,
    };
  }
}
