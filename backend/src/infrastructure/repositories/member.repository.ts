import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IMemberRepository } from '../../domain/repositories/member.repository';
import { Member } from '../../domain/entities/member.entity';
import { MemberMapper } from '../mapper/member.mapper';

@Injectable()
export class MemberRepository implements IMemberRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getAllMembers(): Promise<Member[]> {
    try {
      const members = await this.prisma.member.findMany({
        include: { borrowedBooks: true },
      });
      return members.map((member) => MemberMapper.toDomain(member));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error fetching all members: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown Error fetching all members',
      );
    }
  }

  async getMemberByCode(code: string): Promise<Member | null> {
    try {
      const member = await this.prisma.member.findUnique({
        where: { code },
        include: { borrowedBooks: true },
      });

      if (!member) {
        throw new NotFoundException('Member not found');
      }

      return MemberMapper.toDomain(member);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error fetching member by code: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown Error fetching member by code',
      );
    }
  }

  async findMemberWithBorrowedBooks(
    memberCode: string,
  ): Promise<Member | null> {
    try {
      const member = await this.prisma.member.findUnique({
        where: { code: memberCode },
        include: { borrowedBooks: true },
      });

      if (!member) {
        throw new NotFoundException('Member not found');
      }

      return MemberMapper.toDomain(member);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error fetching member with borrowed books: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown Error fetching member with borrowed books',
      );
    }
  }

  async createMember(code: string, name: string): Promise<Member> {
    try {
      const createdMember = await this.prisma.member.create({
        data: { code, name },
      });

      const fullMember = await this.prisma.member.findUnique({
        where: { code: createdMember.code },
        include: { borrowedBooks: true },
      });

      if (!fullMember) {
        throw new InternalServerErrorException(
          'Failed to retrieve the created member',
        );
      }

      return MemberMapper.toDomain(fullMember);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error creating member: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Unknown Error creating member');
    }
  }

  async updateMember(code: string, name: string): Promise<Member> {
    try {
      const updatedMember = await this.prisma.member.update({
        where: { code },
        data: { name },
        include: { borrowedBooks: true },
      });

      return MemberMapper.toDomain(updatedMember);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.includes('Record to update not found')
      ) {
        throw new NotFoundException('Member not found');
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error updating member: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Unknown Error updating member');
    }
  }

  async deleteMember(code: string): Promise<void> {
    try {
      await this.prisma.member.delete({ where: { code } });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.includes('Record to delete does not exist')
      ) {
        throw new NotFoundException('Member not found');
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error deleting member: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Unknown Error deleting member');
    }
  }

  async generateMemberCode(): Promise<string> {
    try {
      const lastMember = await this.prisma.member.findFirst({
        orderBy: { code: 'desc' },
      });

      let newMemberCode = 'M001';

      if (lastMember && lastMember.code) {
        const lastNumber = parseInt(lastMember.code.substring(1), 10);
        const nextNumber = lastNumber + 1;
        newMemberCode = `M${nextNumber.toString().padStart(3, '0')}`;
      }

      return newMemberCode;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error generating member code: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown Error generating member code',
      );
    }
  }
}
