import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { UpdatePreferencesInput } from '../contracts/update-preferences-input.interface';
import type { UserPreferences } from '../contracts/user-preferences.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class UpdatePreferencesUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(input: UpdatePreferencesInput): Promise<UserPreferences> {
    const user = await this.userRepository.findOne({ where: { id: input.tenantId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const current = user.preferences ?? {};
    const updated: UserPreferences = { ...current };

    if (input.theme !== undefined) {
      updated.theme = input.theme;
    }

    if (input.sidebarCollapsed !== undefined) {
      updated.sidebarCollapsed = input.sidebarCollapsed;
    }

    if (input.locale !== undefined) {
      updated.locale = input.locale;
    }

    user.preferences = updated;
    await this.userRepository.save(user);

    return updated;
  }
}
