import { Module } from '@nestjs/common';
import { BookService } from './application/services/book.service';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { BookRepository } from './infrastructure/repositories/book.repository';
import { MemberRepository } from './infrastructure/repositories/member.repository';
import { BorrowRepository } from './infrastructure/repositories/borrow.repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    BookService,
    {
      provide: 'IBookRepository',
      useClass: BookRepository,
    },
    {
      provide: 'IMemberRepository',
      useClass: MemberRepository,
    },
    {
      provide: 'IBorrowRepository',
      useClass: BorrowRepository,
    },
  ],
})
export class AppModule {}
