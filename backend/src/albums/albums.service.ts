import {Injectable} from '@nestjs/common';
import {CreateAlbumDto} from './dto/create-album.dto';
import {UpdateAlbumDto} from './dto/update-album.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Album} from './entities/album.entity';

@Injectable()
export class AlbumsService {
  constructor(@InjectRepository(Album) private repository: Repository<Album>) {
  }

  create(createAlbumDto: CreateAlbumDto) {
    return this.repository.save(createAlbumDto);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne({
      relations: {
        images: true,
      },
      where: {id},
    });
  }

  update(id: number, updateAlbumDto: UpdateAlbumDto) {
    return this.repository.save({...updateAlbumDto, id});
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
