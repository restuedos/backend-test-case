import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Logger,
} from '@nestjs/common';
import { MemberService } from '../../application/services/member.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMemberDto, UpdateMemberDto } from '../dtos/member.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@ApiTags('members')
@Controller('members')
export class MemberController {
  private readonly logger = new Logger(MemberController.name);

  constructor(private readonly memberService: MemberService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List of all members' })
  async getAllMembers() {
    try {
      this.logger.log('Fetching all members');
      const members = await this.memberService.getAllMembers();
      return {
        success: true,
        message: 'Members retrieved successfully',
        data: members,
      };
    } catch (error: unknown) {
      this.logger.error(
        'Failed to retrieve members',
        error instanceof Error ? error.stack : 'Unknown error',
      );
      throw new InternalServerErrorException('Failed to retrieve members');
    }
  }

  @Get(':code')
  @ApiResponse({ status: 200, description: 'Get member by Code' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async getMemberById(@Param('code') code: string) {
    try {
      this.logger.log(`Fetching member with code: ${code}`);
      const member = await this.memberService.getMemberByCode(code);
      if (!member) {
        this.logger.warn(`Member with code ${code} not found`);
        throw new NotFoundException('Member not found');
      }
      return {
        success: true,
        message: 'Member retrieved successfully',
        data: member,
      };
    } catch (error: unknown) {
      this.logger.error(
        `Failed to get member with code ${code}`,
        error instanceof Error ? error.stack : 'Unknown error',
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get member');
    }
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Member created successfully' })
  async createMember(@Body() createMemberDto: CreateMemberDto) {
    try {
      this.logger.log('Creating a new member');
      const newMember = await this.memberService.createMember(
        createMemberDto.code,
        createMemberDto.name,
      );
      return {
        success: true,
        message: 'Member created successfully',
        data: newMember,
      };
    } catch (error: unknown) {
      this.logger.error(
        'Failed to create member',
        error instanceof Error ? error.stack : 'Unknown error',
      );
      throw new InternalServerErrorException('Failed to create member');
    }
  }

  @Put(':code')
  @ApiResponse({ status: 200, description: 'Member updated successfully' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async updateMember(
    @Param('code') code: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    try {
      this.logger.log(`Updating member with code: ${code}`);
      const updatedMember = await this.memberService.updateMember(
        code,
        updateMemberDto.name,
      );
      if (!updatedMember) {
        this.logger.warn(`Member with code ${code} not found`);
        throw new NotFoundException('Member not found');
      }
      return {
        success: true,
        message: 'Member updated successfully',
        data: updatedMember,
      };
    } catch (error: unknown) {
      this.logger.error(
        `Failed to update member with code ${code}`,
        error instanceof Error ? error.stack : 'Unknown error',
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update member');
    }
  }

  @Delete(':code')
  @ApiResponse({ status: 200, description: 'Member deleted successfully' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async deleteMember(@Param('code') code: string) {
    try {
      this.logger.log(`Deleting member with code: ${code}`);
      await this.memberService.deleteMember(code);
      return {
        success: true,
        message: 'Member deleted successfully',
      };
    } catch (error: unknown) {
      this.logger.error(
        `Failed to delete member with code ${code}`,
        error instanceof Error ? error.stack : 'Unknown error',
      );
      throw new InternalServerErrorException('Failed to delete member');
    }
  }
}
