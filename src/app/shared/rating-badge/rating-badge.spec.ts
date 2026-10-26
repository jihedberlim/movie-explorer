import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingBadge } from './rating-badge';

describe('RatingBadge', () => {
  let fixture: ComponentFixture<RatingBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingBadge);
  });

  async function render(rating: number): Promise<HTMLElement> {
    fixture.componentRef.setInput('rating', rating);
    await fixture.whenStable();
    return fixture.nativeElement.querySelector('span');
  }

  it('should show the rating with one decimal', async () => {
    const badge = await render(7.856);
    expect(badge.textContent?.trim()).toBe('7.9');
  });

  it('should be green for a high rating', async () => {
    const badge = await render(8);
    expect(badge.classList).toContain('bg-green-600');
  });

  it('should show "N/A" when nobody voted yet', async () => {
    const badge = await render(0);
    expect(badge.textContent?.trim()).toBe('N/A');
  });
});
