import {Tag} from './tags.interface';

export interface Image {
  id?: number;
  name: string;
  key: string;
  url: string;
  tags: Tag[];
  description?: string
  selected?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
