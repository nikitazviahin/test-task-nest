import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

import { PG_CONNECTION } from 'src/constants/db';

// const DbProvider = {
//   provide: PG_CONNECTION,
//   useValue: new Pool({
//     user: 'mykyta',
//     host: 'localhost',
//     database: 'population_data',
//     password: 'Circus322',
//     port: 5432,
//   }),
// };

const DbProvider = {
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

@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [ConfigService],
      ...DbProvider,
    },
  ],
  exports: [
    {
      inject: [ConfigService],
      ...DbProvider,
    },
  ],
})
export class DbModule {}
