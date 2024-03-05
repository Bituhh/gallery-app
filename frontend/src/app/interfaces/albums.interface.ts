import {Image} from './images.interface';

export interface Album {
  id?: number;
  name: string;
  description: string;
  images?: Image[];
}
