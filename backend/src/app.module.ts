import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { BookRepository } from './infrastructure/repositories/book.repository';
import { MemberRepository } from './infrastructure/repositories/member.repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: 'IBookRepository',
      useClass: BookRepository,
    },
    {
      provide: 'IMemberRepository',
      useClass: MemberRepository,
    },
  ],
})
export class AppModule {}
