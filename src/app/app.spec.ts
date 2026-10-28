import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render the app name in the header', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header')?.textContent).toContain('Movie Explorer');
  });

  it('should switch to dark mode with the button in the header', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Switch to dark mode"]',
    );

    button.click();
    await fixture.whenStable();

    expect(document.documentElement.classList).toContain('dark');
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode');
  });
});
