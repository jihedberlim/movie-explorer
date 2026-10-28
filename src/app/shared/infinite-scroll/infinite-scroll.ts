import { DestroyRef, Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScroll {
  readonly scrolled = output<void>();

  constructor() {
    const element = inject(ElementRef).nativeElement;

    // rootMargin starts loading a bit before the user really reaches the end
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.scrolled.emit();
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(element);

    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }
}
