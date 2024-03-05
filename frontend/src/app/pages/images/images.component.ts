import {Component, computed, effect, OnDestroy, OnInit, signal} from '@angular/core';
import {
  AlertController,
  IonButton,
  IonButtons, IonCheckbox,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader, IonIcon, IonImg,
  IonMenuButton, IonProgressBar, IonRouterLink,
  IonRow,
  IonTitle,
  IonToolbar, NavController,
} from '@ionic/angular/standalone';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import {ImagesService} from '../../services/images.service';
import {JsonPipe, NgOptimizedImage} from '@angular/common';
import {LongPressDirective} from '../../../directives/long-press.directive';
import {Image} from '../../interfaces/images.interface';
import {addIcons} from 'ionicons';
import {
  arrowDownOutline, arrowDownSharp,
  arrowUpOutline, arrowUpSharp,
  checkmarkDoneCircleOutline, checkmarkDoneCircleSharp,
  closeCircleOutline, closeCircleSharp,
  trashOutline, trashSharp,
} from 'ionicons/icons';
import {ActivatedRoute} from '@angular/router';
import {TagsService} from '../../services/tags.service';
import {Subscription} from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButtons,
    IonMenuButton,
    IonFooter,
    IonButton,
    IonProgressBar,
    JsonPipe,
    IonImg,
    NgOptimizedImage,
    LongPressDirective,
    IonCheckbox,
    IonIcon,
  ],
})
export class ImagesComponent implements OnInit, OnDestroy {

  localLoading = signal(false);
  loading = computed(() => this.localLoading());
  images = this.imagesService.images;
  tag = this.tagsService.selectedTag;

  ascendingOrder = true;

  isSelectionMode = false;
  subscription = new Subscription();

  constructor(private readonly imagesService: ImagesService,
              private readonly tagsService: TagsService,
              private readonly navController: NavController,
              private readonly activatedRoute: ActivatedRoute,
              private readonly alertController: AlertController) {
    addIcons({
      checkmarkDoneCircleOutline,
      checkmarkDoneCircleSharp,
      trashOutline,
      trashSharp,
      closeCircleSharp,
      closeCircleOutline,
      arrowUpOutline,
      arrowUpSharp,
      arrowDownOutline,
      arrowDownSharp,
    });

    effect(() => {
      const tag = this.tag();
      if (!tag) {
        return;
      }

      // This is a tag search
      const images = this.images() ?? [];
      if (images.length === 0) {
        // No images found for the tag
        this.alertController.create({
          header: 'No image on this tag',
          message: 'No image found for this tag, would you like to delete it?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Delete',
              handler:async () => {
                await this.tagsService.deleteTag(tag.id!);
                await this.navController.navigateRoot(['/images']);
              },
            },
          ],
        }).then(alert => alert.present());
      }
    });
  }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async ({tag: tagId}) => {
      this.localLoading.set(true);

      if (tagId) {
        await this.tagsService.getTag(+tagId);
      } else {
        this.tagsService.selectedTag.set(null);
      }

      await this.imagesService.getImages({
        orderBy: this.ascendingOrder ? 'asc' : 'desc',
        tag: tagId ? +tagId : undefined,
      }).catch(error => {
        console.error(error);
        this.localLoading.set(false);
        throw error;
      });

      this.localLoading.set(false);
    });
  }

  async onUploadImage() {
    this.localLoading.set(true);
    const images = await Camera.pickImages({
      quality: 100,
    }).catch(error => {
      console.error(error);
      this.localLoading.set(false);
      throw error;
    });

    for (const image of images.photos) {
      console.log(image);

      await this.imagesService.uploadImage(image.webPath!, this.tag() ?? undefined).catch(error => {
        console.error(error);
        this.localLoading.set(false);
        throw error;
      });
    }

    this.localLoading.set(false);
  }

  async onTakePicture() {
    this.localLoading.set(true);
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      source: CameraSource.Camera,
      resultType: CameraResultType.Uri,
    }).catch(error => {
      console.error(error);
      this.localLoading.set(false);
      throw error;
    });
    console.log(image);

    await this.imagesService.uploadImage(image.webPath!, this.tag() ?? undefined).catch(error => {
      console.error(error);
      this.localLoading.set(false);
      throw error;
    });

    this.localLoading.set(false);
  }

  onSelectImage(imageId: number) {
    this.isSelectionMode = true;
    this.images.update(images => {
      return images.map(img => {
        if (img.id === imageId) {
          img.selected = !img.selected;
        }
        return img;
      });
    });
  }

  onSelectAllImages() {
    this.images.update(images => {
      return images.map(img => {
        img.selected = true;
        return img;
      });
    });
  }

  onDeleteSelectedImages() {
    this.localLoading.set(true);
    const selectedImages = this.images().filter(img => img.selected);
    for (const image of selectedImages) {
      this.imagesService.deleteImage(image.id!).catch(error => {
        console.error(error);
        this.localLoading.set(false);
        throw error;
      });
    }
    this.isSelectionMode = false;
    this.localLoading.set(false);
  }

  onExitSelectionMode() {
    this.isSelectionMode = false;
    this.images.update(images => {
      return images.map(img => {
        img.selected = false;
        return img;
      });
    });
  }

  async onTapImage(imageId: number) {
    if (this.isSelectionMode) {
      this.onSelectImage(imageId);
      return;
    }

    const image = this.images().find(img => img.id === imageId);
    if (!image) {
      throw new Error('Image not found');
    }
    this.imagesService.selectedImage.set(image);

    await this.navController.navigateForward(['/images', imageId]);
  }

  async onReorder(ascending: boolean) {
    this.ascendingOrder = ascending;
    const tag = this.activatedRoute.snapshot.queryParams['tag'];
    await this.imagesService.getImages({
      orderBy: ascending ? 'asc' : 'desc',
      tag: tag ? +tag : undefined,
    });
  }

  ngOnDestroy() {

  }
}
