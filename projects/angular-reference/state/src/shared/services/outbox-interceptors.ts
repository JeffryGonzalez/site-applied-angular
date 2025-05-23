import { HttpInterceptorFn } from '@angular/common/http';

import { inject, InjectionToken, Injector, Provider } from '@angular/core';
const HTTP_INTERCEPTOR_FNS = new InjectionToken<readonly HttpInterceptorFn[]>(
  ngDevMode ? 'HTTP_INTERCEPTOR_FNS' : '',
);

export class OutboxInterceptorRegistry {
  private interceptors: HttpInterceptorFn[] = [];
  private injector = inject(Injector);
  addInterceptor(interceptor: HttpInterceptorFn): void {
    if (!this.interceptors.includes(interceptor)) {
      this.interceptors.push(interceptor);
      this.updateInterceptors();
    }
  }

  private updateInterceptors(): void {
    const providers: Provider[] = this.interceptors.map((interceptor) => ({
      provide: HTTP_INTERCEPTOR_FNS,
      useValue: interceptor,
      multi: false,
    }));
    // Destroy and re-create the injector with updated providers
    const newInjector = Injector.create({
      providers: providers,
      parent: this.injector,
    });
    // Replace the application injector with the new one
    // (this.injector as any)._destroyed = true;
    // (this.injector as any)._parent = newInjector;
    this.injector = newInjector;
  }
}
