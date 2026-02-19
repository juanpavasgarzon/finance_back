import { Injectable } from '@nestjs/common';

import { NotificationsService, WELCOME } from 'modules/notifications';
import type { CreateUserResult } from 'modules/users';
import { UsersService } from 'modules/users';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async execute(email: string, password: string): Promise<CreateUserResult> {
    const user = await this.usersService.createUser(email, password);

    await this.notificationsService.notify({
      tenantId: user.id,
      code: WELCOME,
      title: 'Welcome',
      message: 'Your account has been created successfully. You can now manage your expenses and income.',
      emitRealtime: false,
    });

    return user;
  }
}
