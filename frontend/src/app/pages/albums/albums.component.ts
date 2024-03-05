import {Component, OnInit} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard, IonCardContent,
  IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonCol,
  IonContent, IonFooter,
  IonGrid,
  IonHeader, IonIcon, IonInput, IonMenuButton,
  IonRow, IonTextarea,
  IonTitle,
  IonToolbar, NavController,
} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {addOutline, addSharp} from 'ionicons/icons';
import {AlbumsService} from '../../services/albums.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Album} from '../../interfaces/albums.interface';
import {RouterLink} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
  imports: [
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonButtons,
    IonMenuButton,
    IonFooter,
    IonButton,
    IonInput,
    IonTextarea,
    IonIcon,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class AlbumsComponent implements OnInit {
  isAddingAlbum = false;
  albums = this.albumsService.albums;

  addAlbumForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(),
  });

  constructor(private readonly albumsService: AlbumsService,
              private readonly navController: NavController) {
    addIcons({
      addOutline,
      addSharp,
    });
  }

  ngOnInit() {
    this.albumsService.getAlbums();
  }

  async onAddAlbum() {
    await this.albumsService.create(this.addAlbumForm.value as Album);
    this.isAddingAlbum = false;
  }

  async onViewAlbum(album: Album) {
    await this.albumsService.getAlbum(album.id!);
    await this.navController.navigateForward(['/albums', album.id]);
  }
}
