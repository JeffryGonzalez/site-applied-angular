import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { outboxFeature } from '../shared/state';
import { addRequestToOutbox } from '../shared/state/interceptors';
import { provideEffects } from '@ngrx/effects';
import { OutboxEffects } from '../shared/state/effects/outbox.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([addRequestToOutbox])),
    provideStore(),
    provideStoreDevtools(),
    provideEffects([OutboxEffects]),
    provideState(outboxFeature),
  ],
};
