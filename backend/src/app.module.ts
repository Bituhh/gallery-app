import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ImagesModule } from './images/images.module';
import { AlbumsModule } from './albums/albums.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    DatabaseModule,
    ImagesModule,
    AlbumsModule,
    TagsModule
  ],
})
export class AppModule {}
