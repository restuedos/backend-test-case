import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { BookRepository } from './infrastructure/repositories/book.repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: 'IBookRepository',
      useClass: BookRepository,
    },
  ],
})
export class AppModule {}
