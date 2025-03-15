import { Module } from '@nestjs/common';
import { BookService } from './application/services/book.service';
import { MemberService } from './application/services/member.service';
import { BorrowService } from './application/services/borrow.service';
import { BookController } from './interfaces/controllers/book.controller';
import { MemberController } from './interfaces/controllers/member.controller';
import { BorrowController } from './interfaces/controllers/borrow.controller';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { BookRepository } from './infrastructure/repositories/book.repository';
import { MemberRepository } from './infrastructure/repositories/member.repository';
import { BorrowRepository } from './infrastructure/repositories/borrow.repository';

@Module({
  imports: [],
  controllers: [BookController, MemberController, BorrowController],
  providers: [
    PrismaService,
    BookService,
    MemberService,
    BorrowService,
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
