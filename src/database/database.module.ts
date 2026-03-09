import * as path from 'path';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '../config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        logging: config.get<boolean>('database.logging'),
        autoLoadEntities: true,
        migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
        migrationsRun: config.get<string>('app.nodeEnv') === 'production',
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
