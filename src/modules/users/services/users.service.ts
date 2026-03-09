import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import type { CreateUserResult } from '../contracts/create-user-result.interface';
import type { ValidateCredentialsResult } from '../contracts/validate-credentials-result.interface';
import { User } from '../entities/user.entity';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { FindUserByUsernameUseCase } from '../use-cases/find-user-by-username.use-case';
import { FindUserByIdUseCase } from '../use-cases/find-user-by-id.use-case';

@Injectable()
export class UsersService {
  constructor(
    private readonly findUserByUsernameUseCase: FindUserByUsernameUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  async createUser(username: string, password: string, country?: string): Promise<CreateUserResult> {
    const user = await this.createUserUseCase.execute(username, password, country);
    return { id: user.id, username: user.username, country: user.country };
  }

  async findById(id: string): Promise<User> {
    const user = await this.findUserByIdUseCase.execute(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async validateCredentials(username: string, password: string): Promise<ValidateCredentialsResult | null> {
    const user = await this.findUserByUsernameUseCase.execute(username);
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
