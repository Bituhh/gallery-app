import {Component, OnInit} from '@angular/core';
import {addIcons} from 'ionicons';
import {albumsOutline, albumsSharp, bookmarkOutline, bookmarkSharp, imagesOutline, imagesSharp} from 'ionicons/icons';
import {
  IonContent, IonIcon, IonItem, IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote, IonRouterOutlet,
  IonSplitPane,
} from '@ionic/angular/standalone';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
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
    RouterLink,
    RouterLinkActive,
    IonRouterOutlet,
  ],
})
export class HomeComponent {
  public pages = [
    {title: 'Images', url: '/images', icon: 'images'},
    {title: 'Albums', url: '/albums', icon: 'albums'},
  ];
  public tags = [];

  constructor() {
    addIcons({
      imagesSharp,
      imagesOutline,
      albumsSharp,
      albumsOutline,
      bookmarkSharp,
      bookmarkOutline,
    });
  }
}
