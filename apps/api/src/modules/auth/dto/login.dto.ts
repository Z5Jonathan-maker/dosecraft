import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@dosecraft.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  readonly email!: string;

  @ApiProperty({ example: 'SecureP@ss1' })
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  readonly password!: string;
}
