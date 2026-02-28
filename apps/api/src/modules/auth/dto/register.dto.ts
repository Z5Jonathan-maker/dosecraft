import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@dosecraft.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  readonly email!: string;

  @ApiProperty({ example: 'SecureP@ss1' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  readonly password!: string;

  @ApiProperty({ example: 'Jonathan', required: false })
  @IsString()
  @MaxLength(100)
  readonly name?: string;
}
