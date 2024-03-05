import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {fetchAuthSession} from 'aws-amplify/auth';
import {environment} from '../../environments/environment';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

@Injectable({providedIn: 'root'})
export class ApiService {

  constructor(private readonly httpClient: HttpClient) {
  }

  async request<Response = { [key: string]: boolean | string | number | Date | object }>(request: {
    method: HttpMethod,
    path: string,
    pathParameters?: { [key: string]: string | number | boolean | Date | undefined | null },
    body?: unknown,
    queryParams?: { [key: string]: string | number | boolean | Date | undefined | null },
    headers?: { [key: string]: string },
    public?: boolean,
  }) {
    if (!request.path.startsWith('/')) {
      throw new Error('Path must start with a slash');
    }

    let pathWithArguments = request.path;
    Object.entries(request.pathParameters ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        pathWithArguments = pathWithArguments.replace(`{${key}}`, encodeURIComponent(value.toString()));
      }
    });

    const url = new URL(`${environment.APP_REST_API_ENDPOINT}${pathWithArguments}`);
    Object.entries(request.queryParams ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, encodeURIComponent(value.toString()));
      }
    });

    return lastValueFrom(this.httpClient.request<Response>(
      request.method,
      url.toString(),
      {
        body: request.body,
        reportProgress: true,
        headers: {
          'Content-Type': 'application/json',
          ...request.headers ?? {},
        },
      }),
    );
  }
}
