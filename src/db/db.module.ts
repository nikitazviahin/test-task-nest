import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

import { PG_CONNECTION } from 'src/constants/db';

const PgConfig = {
  provide: PG_CONNECTION,
  useFactory: async (configService: ConfigService) => {
    const pool = new Pool({
      user: configService.get('DB_USER'),
      database: configService.get('DB_NAME'),
      password: configService.get('DB_PASSWORD'),
      host: 'localhost',
      port: 5432,
    });

    return pool;
  },
};

const PgProvider = {
  inject: [ConfigService],
  ...PgConfig,
};

@Module({
  imports: [ConfigModule],
  providers: [PgProvider],
  exports: [PgProvider],
})
export class DbModule {}
