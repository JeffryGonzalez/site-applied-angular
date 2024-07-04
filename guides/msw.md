# Mock Service Worker

[Mock Service Worker](https://mswjs.io/) is a development library for working with APIs as you develop 
or test your front end applications.

[Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) are a browser feature that allows
developers to run JavaScript code in the browser as an isolated *service* and are used in many scenarios
to provide and augment functionality to JavaScript applications. 

The MSW library is implemented as a service worker that is only (or should only) be used during development.

The service worker will intercept each HTTP request made by your application and, if a request is made that is 
matched by our code within the MSW, use our implementation instead of sending the request to an actual API.

I installed the Mock Service Worker library:

```sh
npm i -D msw
```

I then initialized it, telling it to put the service worker file in my `src`
directory with:

```sh
npx msw init src
```

In the `angular.json` configuration, for development, tell it to include that
file in the assets:

```json
"development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true,
              "assets": [ // [!code ++]
                  "src/mockServiceWorker.js" // [!code ++]
              ] // [!code ++]
            }
```

In the `src/mocks` directory, added two files:

::: code-group

```typescript [browser.ts]
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
export const worker = setupWorker(...handlers);
```

```typescript [handlers.ts]
import { http, HttpResponse } from "msw";
export const handlers = [
  // Add handlers Here
];
```

:::

In an app where you might make an API call that will be fulfilled by a Mock
Service Worker before the service worker has initialized, you will get failures.

The code in `main.ts` awaits the setup of the Mock Service Worker:

```ts{6-14,17-21}
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { isDevMode } from '@angular/core';

async function prepareApp() {
  if(isDevMode()) {
   const { worker} = await import('./mocks/browser');
   return worker.start({
    onUnhandledRequest: 'bypass'
   });
  }
  return Promise.resolve();
}


prepareApp().then(() => {
  bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err)
  );
});
```

