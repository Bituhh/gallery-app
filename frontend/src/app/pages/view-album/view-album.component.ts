import {Component, effect, OnInit, ViewChild} from '@angular/core';
import {
  IonBackButton, IonButton,
  IonButtons, IonCheckbox, IonCol,
  IonContent,
  IonGrid,
  IonHeader, IonIcon, IonImg, IonModal, IonRouterLink, IonRow,
  IonTitle,
  IonToolbar, NavController,
} from '@ionic/angular/standalone';
import {AlbumsService} from '../../services/albums.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {addIcons} from 'ionicons';
import {addOutline, addSharp, saveOutline, saveSharp, trashOutline, trashSharp} from 'ionicons/icons';
import {ImagesService} from '../../services/images.service';

@Component({
  standalone: true,
  selector: 'app-view-album',
  templateUrl: './view-album.component.html',
  styleUrls: ['./view-album.component.scss'],
  imports: [
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonModal,
    IonCheckbox,
    IonImg,
    RouterLink,
    IonRouterLink,
  ],
})
export class ViewAlbumComponent  implements OnInit {

  @ViewChild(IonModal) modal!: IonModal;

  album = this.albumsService.selectedAlbum;
  images = this.imagesService.images;

  constructor(private readonly albumsService: AlbumsService,
              private readonly imagesService: ImagesService,
              private readonly navController: NavController,
              private readonly activatedRoute: ActivatedRoute) {
    addIcons({
      addOutline,
      addSharp,
      trashOutline,
      trashSharp,
    });
  }

  async ngOnInit() {
    if (!this.album()) {
      const id = this.activatedRoute.snapshot.paramMap.get('id')!;
      await this.albumsService.getAlbum(+id);
    }
  }

  async onModalWillPresent() {
    await this.imagesService.getImages();
    this.images.update(images => {
      return images.map(image => {
        return {
          ...image,
          // If the image is on the album, mark it as selected
          selected: (this.album()!.images ?? []).some(albumImage => albumImage.id === image.id),
        }
      });
    })
  }

  async onDeleteAlbum() {
    await this.albumsService.deleteAlbum(this.album()!.id!);
    await this.navController.navigateBack(['/albums']);
  }

  async onConfirmSelection() {
    const album = this.album()!;
    await this.albumsService.updateAlbum(album.id!, {
      ...album,
      images: this.images().filter(image => image.selected),
    });
    await this.modal.dismiss();
  }

  onCancelSelection() {
    this.modal.dismiss();
  }
}
