import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import * as process from 'process';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        autoLoadEntities: true,
        synchronize: process.env.STAGE === 'dev',
        logging: process.env.STAGE === 'dev',
      })
    })
  ]
})
export class DatabaseModule {}
