import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { LanguageService } from '../services/language.service';
import { TranslationKey } from './translations';

const APP_NAME = 'Movie Explorer';

// The "title" of each route is a translation key, so the browser tab follows the language
@Injectable({ providedIn: 'root' })
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly language = inject(LanguageService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const key = this.buildTitle(snapshot) as TranslationKey | undefined;
    this.title.setTitle(key ? `${this.language.t(key)} | ${APP_NAME}` : APP_NAME);
  }
}
