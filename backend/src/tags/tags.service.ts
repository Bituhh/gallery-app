import {Injectable} from '@nestjs/common';
import {CreateTagDto} from './dto/create-tag.dto';
import {UpdateTagDto} from './dto/update-tag.dto';
import {ILike, Repository} from 'typeorm';
import {Tag} from './entities/tag.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Image} from '../images/entities/image.entity';

@Injectable()
export class TagsService {

  constructor(@InjectRepository(Tag) private repository: Repository<Tag>) {
  }

  create(createTagDto: CreateTagDto) {
    return this.repository.save(createTagDto);
  }

  findAll(filter?: string) {
    return this.repository.find(filter ? {
      where: {
        name: ILike(`%${filter}%`),
      },
    } : {});
  }

  findOne(id: number) {
    return this.repository.findOne({
      where: {id},
    });
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return this.repository.save({...updateTagDto, id});
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
