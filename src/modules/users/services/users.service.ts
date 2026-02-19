import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import type { CreateUserResult } from '../contracts/create-user-result.interface';
import type { ValidateCredentialsResult } from '../contracts/validate-credentials-result.interface';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { FindUserByEmailUseCase } from '../use-cases/find-user-by-email.use-case';

@Injectable()
export class UsersService {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async createUser(email: string, password: string): Promise<CreateUserResult> {
    const user = await this.createUserUseCase.execute(email, password);
    return { id: user.id, email: user.email };
  }

  async validateCredentials(email: string, password: string): Promise<ValidateCredentialsResult | null> {
    const user = await this.findUserByEmailUseCase.execute(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return null;
    }

    return { id: user.id };
  }
}
