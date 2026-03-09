import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class FindUserByUsernameUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username: ILike(username) } });
  }
}
