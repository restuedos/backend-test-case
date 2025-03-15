import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty({
    example: 'M123',
    description: 'Unique member code (3-10 characters) - Optional',
    minLength: 3,
    maxLength: 10,
  })
  @IsString()
  @Length(3, 10)
  code?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the member (3-50 characters)',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name!: string;
}

export class UpdateMemberDto {
  @ApiProperty({
    example: 'Jane Doe',
    description: 'Updated full name of the member (3-50 characters)',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name!: string;
}
