import {Injectable, signal} from '@angular/core';
import {ApiService, HttpMethod} from './api.service';
import {Album} from '../interfaces/albums.interface';
import { ImagesService } from './images.service';

@Injectable({
  providedIn: 'root',
})
export class AlbumsService {

  albums = signal<Album[]>([])
  selectedAlbum = signal<Album | null>(null);

  constructor(private readonly apiService: ApiService,
              private readonly imagesService: ImagesService) {
  }

  async create(album: Album) {
    const newAlbum = await this.apiService.request<Album>({
      method: HttpMethod.POST,
      path: '/albums',
      body: album,
    });

    this.albums.update((albums) => [...albums, newAlbum]);
  }

  async getAlbums() {
    const albums = await this.apiService.request<Album[]>({
      method: HttpMethod.GET,
      path: '/albums',
    });

    this.albums.set(albums);
  }

  async getAlbum(id: number) {
    const album = await this.apiService.request<Album>({
      method: HttpMethod.GET,
      path: `/albums/{id}`,
      pathParameters: {id},
    });

    for (let image of (album.images ?? [])) {
      image.url = await this.imagesService.getImageUrl(image.key);
    }

    console.log(album);

    this.selectedAlbum.set(album);
    this.albums.update((albums) => albums.map((a) => a.id === album.id ? album : a));
  }

  async updateAlbum(id: number, album: Album) {
    console.log(album);

    await this.apiService.request({
      method: HttpMethod.PATCH,
      path: `/albums/{id}`,
      pathParameters: {id},
      body: album,
    });

    this.selectedAlbum.update((a) => ({...a, ...album}));
  }

  async deleteAlbum(id: number) {
    await this.apiService.request({
      method: HttpMethod.DELETE,
      path: `/albums/{id}`,
      pathParameters: {id},
    });

    this.albums.update((albums) => albums.filter((a) => a.id !== id));
  }
}
