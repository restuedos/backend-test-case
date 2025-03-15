import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      console.log('✅ Successfully connected to the database');
    } catch (error: unknown) {
      console.error('❌ Error connecting to the database:', error);
      process.exit(1);
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.$disconnect();
      console.log('🔌 Disconnected from database');
    } catch (error: unknown) {
      console.error('❌ Error disconnecting from database:', error);
    }
  }
}
