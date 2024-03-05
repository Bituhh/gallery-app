import {Component, effect, OnDestroy, OnInit} from '@angular/core';
import {
  IonBackButton, IonButton,
  IonButtons, IonChip, IonCol,
  IonContent, IonGrid,
  IonHeader, IonIcon,
  IonImg, IonInput, IonItem, IonLabel, IonList, IonPopover, IonRow, IonSelect, IonSelectOption, IonTextarea,
  IonTitle,
  IonToolbar, NavController,
} from '@ionic/angular/standalone';
import {ImagesService} from '../../services/images.service';
import {ActivatedRoute} from '@angular/router';
import {addIcons} from 'ionicons';
import {closeOutline, closeSharp, saveOutline, saveSharp, trashOutline, trashSharp} from 'ionicons/icons';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Image} from '../../interfaces/images.interface';
import {debounceTime, Subscription} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {AutocompleteComponent} from '../../shared/autocomplete/autocomplete.component';
import {TagsService} from '../../services/tags.service';
import {Tag} from '../../interfaces/tags.interface';

@Component({
  standalone: true,
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss'],
  imports: [
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonImg,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    ReactiveFormsModule,
    IonLabel,
    IonTextarea,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonPopover,
    AsyncPipe,
    AutocompleteComponent,
    IonChip,
    IonList,
  ],
})
export class ViewImageComponent implements OnInit, OnDestroy {

  image = this.imagesService.selectedImage;
  form = new FormGroup({
    id: new FormControl(),
    name: new FormControl(''),
    description: new FormControl(),
    tags: new FormControl<Tag[]>([]),
  });
  subscription = new Subscription();

  constructor(private readonly imagesService: ImagesService,
              private readonly tagsService: TagsService,
              private readonly navController: NavController,
              private readonly activatedRoute: ActivatedRoute) {
    addIcons({
      trashOutline,
      trashSharp,
      saveOutline,
      saveSharp,
      closeOutline,
      closeSharp,
    });

    effect(() => {
      const image = this.image();
      const isImage = (img: Image | null): img is Image => img !== null;
      if (!isImage(image)) {
        return;
      }

      this.form.setValue({
        id: image.id,
        name: image.name,
        description: image.description,
        tags: image.tags,
      });
    });
  }

  async ngOnInit() {
    if (!this.image()) {
      const id = this.activatedRoute.snapshot.paramMap.get('id')!;
      await this.imagesService.getImage(+id);
      // If there is no image, navigate back to the images page
    }

    this.subscription.add(
      this.form.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
        console.log(value);
        this.onSaveChanges();
      }),
    );
  }

  async onDeleteImage() {
    await this.imagesService.deleteImage(this.image()?.id!);

    await this.navController.navigateBack('/images');
  }

  async onSaveChanges() {
    await this.imagesService.updateImage(this.form.get('id')!.value!, this.form.value as Partial<Image>);
  }

  onGetOptions = async (input: string) => {
    const options = await this.tagsService.getTags(input);
    return options.map(tag => ({
      id: tag.id!, // Tag was just fetched from the server, so it will always have an ID
      label: tag.name,
    }));
  };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async onAddTag(option: { id?: number; label: string }) {
    const getTag = async () => {
      if (option.id) {
        return await this.tagsService.getTag(option.id);
      }
      return await this.tagsService.createTag({name: option.label});
    };
    const tag = await getTag();
    this.form.patchValue({
      tags: [...this.form.get('tags')!.value ?? [], tag],
    })
  }

  onRemoveTag(tag: Tag) {
    this.form.patchValue({
      tags: (this.form.get('tags')!.value ?? []).filter((t: Tag) => t.id !== tag.id),
    });
  }
}
