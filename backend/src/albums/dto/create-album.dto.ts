import {Image} from '../../images/entities/image.entity';

export class CreateAlbumDto {
  name: string;
  description?: string;
  images?: Image[];
}
