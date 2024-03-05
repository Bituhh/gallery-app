import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Image} from '../interfaces/images.interface';
import {lastValueFrom} from 'rxjs';
import {getUrl, uploadData, remove} from 'aws-amplify/storage';
import {ApiService, HttpMethod} from './api.service';
import {Tag} from '../interfaces/tags.interface';

@Injectable({providedIn: 'root'})
export class ImagesService {
  images = signal<Image[]>([]);
  selectedImage = signal<Image | null>(null);

  constructor(private readonly httpClient: HttpClient,
              private readonly apiService: ApiService) {
  }

  async uploadImage(webPath: string, tag?: Tag): Promise<void> {
    const fileName = webPath.split('/').pop()!; // web path ends with a UUID without extension.
    const blob = await lastValueFrom(this.httpClient.get(webPath, {responseType: 'blob'}));

    const result = await uploadData({
      key: `images/${fileName}`,
      data: blob,
      options: {
        contentType: blob.type,
      },
    }).result;

    // Save the image to the database.
    const image = await this.apiService.request<Image>({
      method: HttpMethod.POST,
      path: '/images',
      body: {
        name: fileName,
        key: result.key,
        tags: tag ? [tag] : [],
      },
    });

    const url = await this.getImageUrl(image.key);
    this.images.update(images => [...images, {
      ...image,
      url,
    }]);
  }

  async getImages(options?: { orderBy: 'asc' | 'desc', tag?: number }) {
    const images = await this.apiService.request<Image[]>({
      method: HttpMethod.GET,
      path: '/images',
      queryParams: options,
    });

    for (const image of images) {
      image.url = await this.getImageUrl(image.key);
    }

    this.images.set(images);
  }

  async getImageUrl(key: string): Promise<string> {
    return (await getUrl({
      key,
    })).url.toString();
  }

  async deleteImage(id: number) {
    const image = this.images().find(image => image.id === id);
    if (!image) {
      throw new Error('Image not found');
    }

    await remove({
      key: image.key,
    });

    await this.apiService.request({
      method: HttpMethod.DELETE,
      path: `/images/{id}`,
      pathParameters: {id},
    });

    this.images.update(images => images.filter(image => image.id !== id));
  }

  async getImage(id: number) {
    const image = await this.apiService.request<Image>({
      method: HttpMethod.GET,
      path: `/images/{id}`,
      pathParameters: {id},
    });
    console.log(image);

    image.url = await this.getImageUrl(image.key);

    this.selectedImage.set(image);
    this.images.update(images => images.map(img => img.id === image.id ? image : img));
  }

  async updateImage(id: number, image: Partial<Image>) {
    const updatedImage = await this.apiService.request<Image>({
      method: HttpMethod.PATCH,
      path: `/images/{id}`,
      pathParameters: {id},
      body: image,
    });

    this.images.update(images => images.map(img => {
      if (img.id === id) {
        return updatedImage;
      }
      return img;
    }));
  }
}
