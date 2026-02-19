import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'modules/users';

import type { JwtPayload } from '../contracts/jwt-payload.interface';
import type { LoginResult } from '../contracts/login-result.interface';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    const result = await this.usersService.validateCredentials(email, password);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: result.id, tenantId: result.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
