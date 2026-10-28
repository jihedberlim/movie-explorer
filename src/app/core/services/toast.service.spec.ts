import { TestBed } from '@angular/core/testing';
import { TOAST_DURATION_MS, ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should show a message', () => {
    service.show('Failed to load');

    expect(service.toasts().map((toast) => toast.message)).toEqual(['Failed to load']);
  });

  it('should hide the message by itself after a few seconds', () => {
    service.show('Failed to load');

    vi.advanceTimersByTime(TOAST_DURATION_MS);

    expect(service.toasts()).toEqual([]);
  });

  it('should not show the same message twice at the same time', () => {
    service.show('Failed to load');
    service.show('Failed to load');

    expect(service.toasts().length).toBe(1);
  });

  it('should show different messages together', () => {
    service.show('Failed to load');
    service.show('Saved');

    expect(service.toasts().length).toBe(2);
  });

  it('should hide a message when the user closes it', () => {
    service.show('Failed to load');

    service.dismiss(service.toasts()[0].id);

    expect(service.toasts()).toEqual([]);
  });
});
