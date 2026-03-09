import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '../config';

const isCompiled = __filename.endsWith('.js');

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
        migrations: isCompiled ? ['dist/database/migrations/*.js'] : ['src/database/migrations/*.ts'],
        migrationsRun: true,
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
