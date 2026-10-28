import { Component, ElementRef, inject, signal } from '@angular/core';
import { LANGUAGES, Language } from '../../core/i18n/translations';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.html',
  host: {
    '(document:click)': 'closeOnOutsideClick($event)',
    '(document:keydown.escape)': 'isOpen.set(false)',
  },
})
export class LanguageSelector {
  protected readonly language = inject(LanguageService);
  private readonly element = inject(ElementRef<HTMLElement>);

  protected readonly languages = LANGUAGES;
  protected readonly isOpen = signal(false);

  toggle(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  select(language: Language): void {
    this.isOpen.set(false);
    this.language.change(language);
  }

  closeOnOutsideClick(event: MouseEvent): void {
    if (!this.element.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }
}
