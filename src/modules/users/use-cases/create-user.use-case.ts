import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { FindUserByEmailUseCase } from './find-user-by-email.use-case';
import { User } from '../entities/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
  ) {}

  async execute(email: string, password: string): Promise<User> {
    const existing = await this.findUserByEmailUseCase.execute(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      passwordHash,
    });
    return this.userRepository.save(user);
  }
}
