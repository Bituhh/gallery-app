import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    DatabaseModule,
    ImagesModule
  ],
})
export class AppModule {}
