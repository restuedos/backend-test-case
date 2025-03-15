import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  Min,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'B123', description: 'Unique book code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'The Great Gatsby', description: 'Book title' })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'F. Scott Fitzgerald', description: 'Author name' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: 5, description: 'Stock count of the book' })
  @IsInt()
  @Min(0)
  stock: number;
}

export class UpdateBookDto {
  @ApiProperty({
    example: 'The Great Gatsby',
    description: 'Updated book title',
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  title: string;

  @ApiProperty({
    example: 'F. Scott Fitzgerald',
    description: 'Updated author name',
  })
  @IsString()
  @IsOptional()
  author: string;

  @ApiProperty({ example: 3, description: 'Updated stock count' })
  @IsInt()
  @Min(0)
  @IsOptional()
  stock: number;
}
