import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { OutboxInterceptorRegistry } from '../shared/services/outbox-interceptors';
import { globalOutboxStore } from '../shared/services/outbox-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([])),
    globalOutboxStore,
    OutboxInterceptorRegistry,
  ],
};
