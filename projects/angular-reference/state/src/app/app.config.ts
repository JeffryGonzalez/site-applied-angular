import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { addOutboxFeatureInterceptor } from '../shared/state/interceptors';

import { routes } from './app.routes';
import { OutboxStore } from '@outbox';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([addOutboxFeatureInterceptor()])),
    OutboxStore,
  ],
};
