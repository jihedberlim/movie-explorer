import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { LANGUAGE_STORAGE_KEY } from '../services/language.service';
import { TranslatedTitleStrategy } from './translated-title.strategy';

@Component({ template: '' })
class EmptyPage {}

describe('TranslatedTitleStrategy', () => {
  beforeEach(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'pt-BR');
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: EmptyPage },
          { path: 'search', title: 'title.search', component: EmptyPage },
        ]),
        { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
      ],
    });
  });

  afterEach(() => {
    // Test files share localStorage, so the language must not leak into the next file
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  });

  it('should translate the page title and add the app name', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/search');
    expect(TestBed.inject(Title).getTitle()).toBe('Buscar | Movie Explorer');
  });

  it('should show only the app name when the route has no title', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    expect(TestBed.inject(Title).getTitle()).toBe('Movie Explorer');
  });
});
