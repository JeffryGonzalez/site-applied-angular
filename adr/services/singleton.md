# Singleton Services 

As we saw in the [Services](./index.md) overview, providing services can get *confusing*, especially in larger, multi-developer applications.

Some of your services should only be provided once within your application. A lot of confusion comes in because of the `@Injectable({provideIn: 'root'})` nonsense, which *probably* doesn't do what you think.

To review:

-  `@Injectable({provideIn: 'root'})` does two things:
   -  Allows Angular to *inject* dependencies into the constructor the service class.
      -  Modern Angular says we should *prefer* using the `inject()` function to inject services, and *not* use the constructor.
   -  The `provideIn: 'root'` option allows you *not* create a provider for this service. If this service is injected somewhere, Angular will create a provider for it automatically.
      -  This *does not* mean that if you *do* create a provider for it (using the components `providers: []` or in the `providers:[]` of a route) it will use just one instance of this service.
      -  You will still get multiple instances of that service, with that services lifetime dependent on where you provided it.

## Creating Actual Singleton Services

The problem we are trying to address here, if it isn't clear enough already, is that a developer working on a component or a feature will provide a service that has already been provided, meaning you will have multiple instances of that service in memory.

This may or may not be a problem, but when it *is* a problem, it's hard to track down. Many services maintain some state. So, for example, if you have a service with a list of `TodoListItems` that are loaded from the server, and a method that adds a `TodoListItem` by calling an API
and caching the response by appending it to the list of items, a secondary instance of this service would have it's *own* list of `TodoListItems`, that it would retrieve from the API (which may or may not match the other services list), and when you add a `TodoListItem`, that result will only be added to the instance it was added to. 

In other words, *many* services should be global instances across your application. 

These kind of "global" services should:

- *Never* be added to a component's `providers` array. That will *always* create a new instance.
- *Might* be provided in the `app.config.ts`'s  `providers` array, *or* a features `routes.ts`'s `providers` array.
  - If the same service is provided in multiple places (the `app.config.ts` and in a features `routes.ts`, you *may* want to throw an error, or
  - Use the same instance as was provided "higher" in the application (and maybe log that it was provided again).


### Not Providing Services in a Component

This one is fairly easy. Angular introduced the concept of an *environment provider* specifically for this purpose (sample code is shown below). If you provide a service using an *environment provider*, Angular will not allow you to add that to a component's `providers: []` array in the component metadata.

### Not Providing A Service in a Route

Even if we *did* create an `environment provider` for our service, we need to make sure that when we provide it in a route, if it has already been provided, it will use the existing service. 

## Creating a Global Service Provider

This could be in a `utils` directory in your application. 

```ts
import { makeEnvironmentProviders } from '@angular/core';

const instances = new Set<string>();

export function provideSingletonService<T extends object, U extends T>(
  baseCtor: abstract new () => T,
  implementationCtor: new () => U,
  deps: unknown[] = [],
  options?: {
    logDuplicateRegistration: boolean;
    throwOnDuplicateRegistration: boolean;
  },
) {
  return () => {
    if (instances.has(baseCtor.name)) {
      if (options?.logDuplicateRegistration) {
        console.warn(`Service ${baseCtor.name} is already registered.`);
      }
      if (options?.throwOnDuplicateRegistration) {
        throw new Error(`Service ${baseCtor.name} is already registered.`);
      }
      return makeEnvironmentProviders([]);
    }
    instances.add(baseCtor.name);
    return makeEnvironmentProviders([
      {
        provide: baseCtor,
        useFactory: () => new implementationCtor(),
        deps: deps,
      },
    ]);
  };
}
```

This creates a function that takes an `abstract` class as the first argument, a *concrete* class that extends the `abstract` class as a second argument, optionally other service dependencies (probably not used), and some options that will log a message if this function is used more than once, or, optionally, throw an error. This function returns a function that you can use in your routes to provide a specific service.

### Using the `provideSingletonService` Function


```ts:line-numbers
import { HttpClient } from '@angular/common/http';
import { inject, signal } from '@angular/core';
import { provideSingletonService } from './global-service-provider';

export abstract class GlobalService {
  abstract get message(): string;
  abstract set message(value: string);
  abstract doIt(): void;
}

class GlobalServiceImpl extends GlobalService {
  #message = signal('Default');
  constructor() {
    console.log('GlobalServiceImpl created');
    super();
  }

  #client = inject(HttpClient);
  doIt() {
    this.#client
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .subscribe((data) => {
        console.log(data);
      });
  }
  override get message(): string {
    return this.#message();
  }

  override set message(value: string) {
    this.#message.set(value);
  }
}

export const provideGlobalService = provideSingletonService(
  GlobalService,
  GlobalServiceImpl,
  [],
  {
    logDuplicateRegistration: true,
    throwOnDuplicateRegistration: false,
  },
);
```

### Explanation

We `export` an abstract class that defines the service functionality (lines 5-9). We use an abstract class here because you cannot add an abstract class to a `providers` array (you will get a build error), but you can pass it as the argument to the `inject()` function. 

Notice we *do not* export the implmentation class (`GlobalServiceImpl`) on lines 11-33. This will keep this from being used outside of this module.

Finally, we export a function (here called `provideGlobalService`) (lines 35-43). This function call is saying "create me an Environment Provider for when someone `inject()`'s a `GlobalService` that uses the `GlobalServiceImpl`. It has no dependencies that haven't already been provided (in this application the `provideHttpClient()` has already been added to `app.config.ts`'s  providers), and I would like to log duplicate registrations to the console, but not throw if there is a duplicate registration (the default for both of these is false)".

So, in the `app.config.ts` (for example), you can provide this service as follows:


```ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideGlobalService } from './services/global.service';
import { provideOtherGlobalService } from './services/other.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideGlobalService(),
    provideOtherGlobalService(), // [!code focus]
  ],
};
```

If you would *mistakenly* provide this in another route's `providers`, it would be essentially a `no-op` (unless you told it to throw on duplicate registrations, then it would be a runtime error).

```ts
import { Routes } from '@angular/router';
import { CounterComponent } from './counter';

import { provideGlobalService } from '../../app/services/global.service';
import { provideOtherGlobalService } from '../../app/services/other.service';

export const COUNTER_ROUTES: Routes = [
  {
    path: '',
    component: CounterComponent,
    children: [],
    providers: [provideGlobalService()], // [!code focus]
  },
];
```

Trying to provide the `GlobalService` abstract class *anywhere* will result in a build error.

Provider functions cannot be used in components.

For example:

```ts:line-numbers
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { OtherGlobalService, provideOtherGlobalService } from '../services/other.service';

@Component({
  selector: 'app-otherpage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  providers: [provideOtherGlobalService()], // [!code error]
  template: ` <p>{{ service.message }}</p> `,
  styles: ``,
})
export class OtherpageComponent {
  service = inject(OtherGlobalService);
}
```

Will give you a build error on line 8 since environment providers cannot be used in components.