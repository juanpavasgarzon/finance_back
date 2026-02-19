import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { FindUserByEmailUseCase } from './use-cases/find-user-by-email.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [FindUserByEmailUseCase, CreateUserUseCase, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
