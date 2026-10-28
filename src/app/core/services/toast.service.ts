import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
}

export const TOAST_DURATION_MS = 4000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly toastsSignal = signal<Toast[]>([]);

  readonly toasts = this.toastsSignal.asReadonly();

  show(message: string): void {
    // When several requests fail together (e.g. the 3 carousels on Home), show the message once
    if (this.toasts().some((toast) => toast.message === message)) {
      return;
    }

    const id = this.nextId++;
    this.toastsSignal.update((toasts) => [...toasts, { id, message }]);
    setTimeout(() => this.dismiss(id), TOAST_DURATION_MS);
  }

  dismiss(id: number): void {
    this.toastsSignal.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
