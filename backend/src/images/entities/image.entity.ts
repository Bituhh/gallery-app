import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, JoinTable,
  ManyToMany, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Album} from '../../albums/entities/album.entity';
import {Tag} from '../../tags/entities/tag.entity';

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @Column()
  key: string;

  @ManyToMany(() => Album, album => album.images, {
    onDelete: 'CASCADE',
  })
  albums: Album[];

  @ManyToMany(() => Tag, {onDelete: 'CASCADE'})
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn({default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @UpdateDateColumn({default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
  updatedAt: Date;
}
