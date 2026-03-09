import { IsOptional, IsString, Length, MinLength } from 'class-validator';

export class RegisterRequest {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  country?: string;
}
