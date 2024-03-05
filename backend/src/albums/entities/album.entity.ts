import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import {Image} from '../../images/entities/image.entity';
import {UpdateAlbumDto} from '../dto/update-album.dto';

@Entity()
export class Album extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @ManyToMany(() => Image, image => image.albums, {
    cascade: true,
  })
  @JoinTable()
  images: Image[];

  @CreateDateColumn({default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @UpdateDateColumn({default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;
}
