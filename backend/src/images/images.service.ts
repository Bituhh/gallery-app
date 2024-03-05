import {Injectable} from '@nestjs/common';
import {CreateImageDto} from './dto/create-image.dto';
import {UpdateImageDto} from './dto/update-image.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Image} from './entities/image.entity';
import {Repository} from 'typeorm';

@Injectable()
export class ImagesService {
  constructor(@InjectRepository(Image) private repository: Repository<Image>) {
  }

  async create(createImageDto: CreateImageDto) {
    const image = await this.repository.save(createImageDto);
    return this.findOne(image.id);
  }

  findAll(options: { ascending?: boolean, tagId?: number } = {
    ascending: true,
  }) {
    return this.repository.find({
      relations: {
        tags: true,
      },
      order: {
        createdAt: options.ascending ? 'ASC' : 'DESC',
      },
      where: options.tagId ? {tags: {id: options.tagId}} : undefined,
    });
  }

  findOne(id: number) {
    return this.repository.findOne({
      relations: {
        tags: true,
      },
      where: {id},
    });
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    await this.repository.save({...updateImageDto, id});
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
