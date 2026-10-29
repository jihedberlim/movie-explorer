import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageService } from '../../core/services/language.service';
import { LanguageSelector } from './language-selector';

describe('LanguageSelector', () => {
  let fixture: ComponentFixture<LanguageSelector>;
  let element: HTMLElement;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [LanguageSelector] }).compileComponents();
    fixture = TestBed.createComponent(LanguageSelector);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  async function openMenu(): Promise<void> {
    element.querySelector<HTMLButtonElement>('button')!.click();
    await fixture.whenStable();
  }

  function optionLabels(): string[] {
    return Array.from(element.querySelectorAll('li span')).map((span) => span.textContent!.trim());
  }

  it('should show the current language and keep the menu closed', () => {
    expect(element.querySelector('button')?.textContent).toContain('EN');
    expect(element.querySelector('ul')?.hidden).toBe(true);
  });

  it('should list the three languages and mark the current one', async () => {
    await openMenu();
    expect(optionLabels()).toEqual(['English', '✓', 'Português', 'Español']);
  });

  it('should change the language when an option is clicked', async () => {
    const language = TestBed.inject(LanguageService);
    const change = vi.spyOn(language, 'change').mockImplementation(() => {});
    await openMenu();

    element.querySelectorAll<HTMLButtonElement>('li button')[1].click();
    await fixture.whenStable();

    expect(change).toHaveBeenCalledWith('pt-BR');
    expect(element.querySelector('ul')?.hidden).toBe(true);
  });

  it('should close the menu when clicking outside of it', async () => {
    await openMenu();

    document.body.click();
    await fixture.whenStable();

    expect(element.querySelector('ul')?.hidden).toBe(true);
  });
});
