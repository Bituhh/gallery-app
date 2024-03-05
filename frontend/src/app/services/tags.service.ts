import {Injectable, signal} from '@angular/core';
import {ApiService, HttpMethod} from './api.service';
import {Tag} from '../interfaces/tags.interface';

@Injectable({
  providedIn: 'root',
})
export class TagsService {

  tags = signal<Tag[]>([]);
  selectedTag = signal<Tag | null>(null);

  constructor(private readonly apiService: ApiService) {
  }

  async getTags(filter?: string) {
    console.log('Getting tags', filter);
    let queryParams = {};
    if (filter) {
      queryParams = {
        filter: filter,
      };
    }
    const tags = await this.apiService.request<Tag[]>({
      method: HttpMethod.GET,
      path: '/tags',
      queryParams,
    });

    if (!filter) { // Only set the tags if we are not filtering
      this.tags.set(tags);
    }
    return tags;
  }

  async createTag(tag: Tag) {
    const newTag = await this.apiService.request<Tag>({
      method: HttpMethod.POST,
      path: '/tags',
      body: tag,
    });
    this.tags.update(tags => [...tags, newTag]);
    return newTag;
  }

  async getTag(id: number) {
    const tag = await this.apiService.request<Tag>({
      method: HttpMethod.GET,
      path: `/tags/{id}`,
      pathParameters: {id},
    });
    this.selectedTag.set(tag);
    return tag;
  }

  async deleteTag(id: number) {
    await this.apiService.request<void>({
      method: HttpMethod.DELETE,
      path: `/tags/{id}`,
      pathParameters: {id},
    });
    this.tags.update(tags => tags.filter(tag => tag.id !== id));
  }
}
