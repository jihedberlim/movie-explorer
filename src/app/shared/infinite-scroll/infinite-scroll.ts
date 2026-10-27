import { DestroyRef, Directive, ElementRef, inject, output } from '@angular/core';

// Put it on an element at the end of a list: "scrolled" fires when that element
// shows up on the screen, so the page can load more items.
@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScroll {
  readonly scrolled = output<void>();

  constructor() {
    const element = inject(ElementRef).nativeElement;

    // IntersectionObserver is the browser's "motion sensor" for elements on screen.
    // rootMargin starts loading a bit before the user really reaches the end.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.scrolled.emit();
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(element);

    // Turn the sensor off when the element is removed from the page
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }
}
