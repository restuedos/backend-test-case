import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/prisma/prisma.service';

@Module({
  imports: [],
  providers: [
    PrismaService,
  ],
})
export class AppModule {}
