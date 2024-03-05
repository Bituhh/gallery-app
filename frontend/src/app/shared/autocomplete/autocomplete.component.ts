import {Component, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {
  IonContent,
  IonInput,
  IonItem,
  IonList,
  IonPopover,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounceTime} from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  imports: [
    IonInput,
    IonContent,
    IonItem,
    IonPopover,
    IonSelect,
    IonSelectOption,
    IonList,
    ReactiveFormsModule,
  ],
})
export class AutocompleteComponent implements OnInit {
  isOpen = false;

  formControl = new FormControl<string>('');
  options = signal<{ id: number, label: string }[]>([]);

  @Input({required: true}) label!: string;
  @Input({required: true}) getOptions: (input: string) => Promise<{ id: number, label: string }[]> = async () => [
    {id: 1, label: 'Option 1'},
    {id: 2, label: 'Option 2'},
    {id: 3, label: 'Option 3'},
  ];
  @Output() selectedOption = new EventEmitter<{ id?: number, label: string }>();

  ngOnInit() {
    this.formControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(async (value) => {
        this.isOpen = false;
        if (value === '' || value === null) {
          return; // Don't show the popover if the input is empty
        }
        const options = await this.getOptions(value);
        this.options.set(options);

        if (options.length === 0) {
          return; // Don't show the popover if there are no options
        }
        this.isOpen = true;
      });
  }

  onSelectOption(option: { id?: number, label: string }) {
    this.formControl.setValue('');
    this.selectedOption.emit(option);
    this.isOpen = false;
  }
}
