import { CommonModule } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {
  IonApp,
  IonContent, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel,
  IonList,
  IonListHeader,
  IonMenu, IonMenuToggle, IonNote,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/angular/standalone';
import {Amplify} from 'aws-amplify';
import {environment} from '../environments/environment';
import {addIcons} from 'ionicons';
import {
  albumsOutline,
  albumsSharp,
  bookmarkOutline,
  bookmarkSharp,
  imagesOutline,
  imagesSharp, trashOutline,
  trashSharp,
} from 'ionicons/icons';
import {TagsService} from './services/tags.service';

Amplify.configure({
  Storage: {
    S3: {
      bucket: environment.AWS_RESOURCES_BUCKET,
      region: environment.AWS_REGION,
    },
  },
  Auth: {
    Cognito: {
      identityPoolId: environment.AWS_IDENTITY_POOL_ID,
      allowGuestAccess: true,
    }
  }
}, {
  Storage: {
    S3: {
      defaultAccessLevel: 'guest', // Ensuring that the default access level is guest, just to be safe.
    }
  }
})

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonRouterOutlet,
    RouterOutlet,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
  ],
})
export class AppComponent implements OnInit {
  public pages = [
    {title: 'Images', url: '/images', icon: 'images'},
    {title: 'Albums', url: '/albums', icon: 'albums'},
  ];
  tags = this.tagsService.tags;

  constructor(private readonly tagsService: TagsService) {
    addIcons({
      imagesSharp,
      imagesOutline,
      albumsSharp,
      albumsOutline,
      bookmarkSharp,
      bookmarkOutline,
      trashSharp,
      trashOutline,
    });
  }

  async ngOnInit() {
    await this.tagsService.getTags();
  }

  onDeleteTag(id: number) {
    this.tagsService.deleteTag(id);
  }
}
