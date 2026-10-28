import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ToastService } from '../services/toast.service';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let toast: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    toast = TestBed.inject(ToastService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should show the error toast and still pass the error to the page', () => {
    let pageGotTheError = false;
    http.get('/data').subscribe({ error: () => (pageGotTheError = true) });

    httpTesting.expectOne('/data').flush(null, { status: 500, statusText: 'Server Error' });

    expect(toast.toasts().map((item) => item.message)).toEqual([
      'Failed to load. Please check your connection and try again.',
    ]);
    expect(pageGotTheError).toBe(true);
  });

  it('should not show a toast when the request works', () => {
    http.get('/data').subscribe();

    httpTesting.expectOne('/data').flush({});

    expect(toast.toasts()).toEqual([]);
  });
});
