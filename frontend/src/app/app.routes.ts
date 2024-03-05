import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'images',
  },
  {
    path: 'images',
    loadComponent: () => import('./pages/images/images.component').then(c => c.ImagesComponent),
  },
  {
    path: 'albums',
    loadComponent: () => import('./pages/albums/albums.component').then(c => c.AlbumsComponent),
  },
  {
    path: 'albums/:id',
    loadComponent: () => import('./pages/view-album/view-album.component').then(c => c.ViewAlbumComponent),
  },
  {
    path: 'images/:id',
    loadComponent: () => import('./pages/view-image/view-image.component').then(c => c.ViewImageComponent),
  },
  {
    path: '**',
    redirectTo: '/',
  }
];
