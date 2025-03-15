import { Inject, Injectable, Logger } from '@nestjs/common';
import { IMemberRepository } from '../../domain/repositories/member.repository';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class MemberService {
  private readonly logger = new Logger(MemberService.name);

  constructor(
    @Inject('IMemberRepository')
    private readonly memberRepository: IMemberRepository,
  ) {}

  async getAllMembers() {
    try {
      this.logger.log('Fetching all members');
      return await this.memberRepository.getAllMembers();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Error retrieving all members', error.stack);
      } else {
        this.logger.error('Unknown error retrieving all members');
      }
      throw new InternalServerErrorException('Error retrieving members');
    }
  }

  async getMemberByCode(code: string) {
    try {
      this.logger.log(`Fetching member with code: ${code}`);
      const member = await this.memberRepository.getMemberByCode(code);
      if (!member) {
        this.logger.warn(`Member with code ${code} not found`);
        throw new NotFoundException('Member not found');
      }
      this.logger.log(`Member with code ${code} retrieved successfully`);
      return member;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof Error) {
        this.logger.error(
          `Error retrieving member with code ${code}`,
          error.stack,
        );
      } else {
        this.logger.error(`Unknown error retrieving member with code ${code}`);
      }
      throw new InternalServerErrorException('Error retrieving member');
    }
  }

  async createMember(code: string | undefined, name: string) {
    try {
      this.logger.log(`Creating member with code: ${code || 'Auto-generated'}`);
      if (!code) {
        code = await this.memberRepository.generateMemberCode();
      }
      const newMember = await this.memberRepository.createMember(code, name);
      this.logger.log(`Member with code ${code} created successfully`);
      return newMember;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Error creating member', error.stack);
      } else {
        this.logger.error('Unknown error creating member');
      }
      throw new InternalServerErrorException('Error creating member');
    }
  }

  async updateMember(code: string, name: string) {
    try {
      this.logger.log(`Updating member with code: ${code}`);
      const updatedMember = await this.memberRepository.updateMember(
        code,
        name,
      );
      if (!updatedMember) {
        this.logger.warn(`Member with code ${code} not found for update`);
        throw new NotFoundException('Member not found');
      }
      this.logger.log(`Member with code ${code} updated successfully`);
      return updatedMember;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof Error) {
        this.logger.error(
          `Error updating member with code ${code}`,
          error.stack,
        );
      } else {
        this.logger.error(`Unknown error updating member with code ${code}`);
      }
      throw new InternalServerErrorException('Error updating member');
    }
  }

  async deleteMember(code: string) {
    try {
      this.logger.log(`Deleting member with code: ${code}`);
      await this.memberRepository.deleteMember(code);
      this.logger.log(`Member with code ${code} deleted successfully`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Error deleting member with code ${code}`,
          error.stack,
        );
      } else {
        this.logger.error(`Unknown error deleting member with code ${code}`);
      }
      throw new InternalServerErrorException('Error deleting member');
    }
  }
}
