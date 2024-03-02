import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home.component').then(c => c.HomeComponent),
    children: [
      {
        path: 'images',
        loadComponent: () => import('./images/images.component').then(c => c.ImagesComponent),
      },
      {
        path: '**',
        redirectTo: 'images',
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/',
  }
];
