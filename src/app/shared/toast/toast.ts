import { Component, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
})
export class Toast {
  protected readonly i18n = inject(LanguageService);

  protected readonly toastService = inject(ToastService);
}
