import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Res, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';

import { UpdatePreferencesUseCase, UsersService } from 'modules/users';
import type { UserPreferences } from 'modules/users';

import { CurrentTenantId } from 'shared';

import { Public } from '../decorators/public.decorator';
import { UpdatePreferencesRequest } from '../../users/dto/request/update-preferences.request';
import { LoginRequest } from '../dto/request/login.request';
import { RegisterRequest } from '../dto/request/register.request';
import { RegisterResponse } from '../dto/response/register.response';
import { LoginUseCase } from '../use-cases/login.use-case';
import { RegisterUseCase } from '../use-cases/register.use-case';

const COOKIE_NAME = 'finance_token';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly usersService: UsersService,
    private readonly updatePreferencesUseCase: UpdatePreferencesUseCase,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: RegisterRequest): Promise<RegisterResponse> {
    const result = await this.registerUseCase.execute(request.username, request.password, request.country);
    return new RegisterResponse(result.id, result.username);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() request: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const result = await this.loginUseCase.execute(request.username, request.password);
    res.cookie(COOKIE_NAME, result.accessToken, COOKIE_OPTIONS);
    return { message: 'ok' };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response): { message: string } {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    return { message: 'ok' };
  }

  @Get('me')
  async me(
    @CurrentTenantId() tenantId: string,
  ): Promise<{ id: string; username: string; country: string; preferences: UserPreferences }> {
    try {
      const user = await this.usersService.findById(tenantId);
      return { id: user.id, username: user.username, country: user.country, preferences: user.preferences ?? {} };
    } catch {
      throw new UnauthorizedException('Invalid session');
    }
  }

  @Patch('preferences')
  @HttpCode(HttpStatus.OK)
  async updatePreferences(
    @CurrentTenantId() tenantId: string,
    @Body() request: UpdatePreferencesRequest,
  ): Promise<UserPreferences> {
    return this.updatePreferencesUseCase.execute({
      tenantId,
      theme: request.theme,
      sidebarCollapsed: request.sidebarCollapsed,
      locale: request.locale,
    });
  }
}
