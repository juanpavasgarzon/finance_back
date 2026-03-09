import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { FindUserByUsernameUseCase } from './find-user-by-username.use-case';
import { User } from '../entities/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly findUserByUsernameUseCase: FindUserByUsernameUseCase,
  ) {}

  async execute(username: string, password: string, country?: string): Promise<User> {
    const existing = await this.findUserByUsernameUseCase.execute(username);

    if (existing) {
      throw new ConflictException('Username already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username: username.trim(),
      passwordHash,
      country: country ?? 'CO',
    });
    return this.userRepository.save(user);
  }
}
