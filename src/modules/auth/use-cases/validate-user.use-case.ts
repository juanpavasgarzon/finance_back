import { Injectable, UnauthorizedException } from '@nestjs/common';

import type { ValidateCredentialsResult } from 'modules/users';
import { UsersService } from 'modules/users';

@Injectable()
export class ValidateUserUseCase {
  constructor(private readonly usersService: UsersService) {}

  async execute(email: string, password: string): Promise<ValidateCredentialsResult> {
    const result = await this.usersService.validateCredentials(email, password);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return result;
  }
}
