import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MediaItem } from '../../core/models/media.model';
import { MediaCarousel } from './media-carousel';

describe('MediaCarousel', () => {
  let fixture: ComponentFixture<MediaCarousel>;

  function createItem(id: number, title: string): MediaItem {
    return { id, title, overview: '', poster_path: null, backdrop_path: null, vote_average: 7 };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaCarousel],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaCarousel);
  });

  it('should show the title and one card per item', async () => {
    fixture.componentRef.setInput('title', 'Trending');
    fixture.componentRef.setInput('items', [createItem(1, 'Dune'), createItem(2, 'Alien')]);
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('h2')?.textContent).toContain('Trending');
    expect(element.querySelectorAll('app-movie-card').length).toBe(2);
  });
});
