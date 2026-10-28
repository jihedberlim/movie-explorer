import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FakeIntersectionObserver } from '../../testing/fake-intersection-observer';
import { InfiniteScroll } from './infinite-scroll';

@Component({
  imports: [InfiniteScroll],
  template: `<div appInfiniteScroll (scrolled)="count = count + 1"></div>`,
})
class Host {
  count = 0;
}

describe('InfiniteScroll', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should emit "scrolled" when the element shows up on the screen', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    FakeIntersectionObserver.showOnScreen();

    expect(fixture.componentInstance.count).toBe(1);
  });
});
