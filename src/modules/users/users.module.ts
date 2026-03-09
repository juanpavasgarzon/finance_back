import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { FindUserByUsernameUseCase } from './use-cases/find-user-by-username.use-case';
import { FindUserByIdUseCase } from './use-cases/find-user-by-id.use-case';
import { UpdatePreferencesUseCase } from './use-cases/update-preferences.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [FindUserByUsernameUseCase, FindUserByIdUseCase, CreateUserUseCase, UpdatePreferencesUseCase, UsersService],
  exports: [UsersService, UpdatePreferencesUseCase],
})
export class UsersModule {}
