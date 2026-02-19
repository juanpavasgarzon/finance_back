import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { Public } from '../decorators/public.decorator';
import { LoginRequest } from '../dto/request/login.request';
import { RegisterRequest } from '../dto/request/register.request';
import { LoginResponse } from '../dto/response/login.response';
import { RegisterResponse } from '../dto/response/register.response';
import { LoginUseCase } from '../use-cases/login.use-case';
import { RegisterUseCase } from '../use-cases/register.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: RegisterRequest): Promise<RegisterResponse> {
    const result = await this.registerUseCase.execute(request.email, request.password);
    return new RegisterResponse(result.id, result.email);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    const result = await this.loginUseCase.execute(request.email, request.password);
    return new LoginResponse(result.accessToken);
  }
}
