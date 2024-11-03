# Using Feature Flags

Using feature flags or feature toggles is nearly a necessity for working in user interface.

There is a _lot_ you can do with them in terms of patterns like continuous integration / continuous delivery, customizing the application for certain segments of your users (e.g. a/b testing, geolocation, etc.). All of that requires a server-side component that will dynamically provide the appropriate values for your feature toggles.

Here, I'm enabling that, but mostly using them to allow us to conditionally allow features to be displayed to the user - so only the client side, and only really thinking of this for continuous integration scenarios.

I got most of this implementation from [Tim Deschryver's Blog Post](https://timdeschryver.dev/blog/consuming-net-feature-flags-within-an-angular-application#feature-flag-directive). I could be extended/improved (using an Ngrx SignalStore, for example, but I wanted to keep it minimal on dependencies.)

## The Code

I'm assuming a directory in the root of your `/src/app` called `feature-management` here.

### The `index.ts`

Only thing here is a `const` for the url of the feature flag server. This is to allow for customization.

```typescript
export const FEATURE_FLAG_URL = "/api/features";
```

### The `feature.service.ts` file:

```typescript
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { FEATURE_FLAG_URL } from ".";

@Injectable({ providedIn: "root" })
export class FeaturesService {
  #client = inject(HttpClient);

  public getEnabledFeatures() {
    return this.#client.get<string[]>(FEATURE_FLAG_URL);
  }
}
```

### The `feature.guard.ts` file:

> Note: I decided to go with the `canMatch` version, but Tim's blog has an alternative:

```typescript
import { inject } from "@angular/core";
import { CanMatchFn } from "@angular/router";
import { map } from "rxjs";
import { FeaturesService } from "./feature.service";

export const canMatchFeature =
  (feature: string): CanMatchFn =>
  () => {
    const featuresService = inject(FeaturesService);
    return featuresService
      .getEnabledFeatures()
      .pipe(map((r) => r.includes(feature)));
  };
```

### The `feature.directive.ts`

```typescript
import {
  Directive,
  inject,
  input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";
import { Subscription } from "rxjs";
import { FeaturesService } from "./feature.service";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "[feature]",
  standalone: true,
})
export class FeatureDirective implements OnInit, OnDestroy {
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef<unknown>);
  private featureService = inject(FeaturesService);
  private subscription?: Subscription;

  public feature = input.required<string>();

  public ngOnInit(): void {
    this.subscription = this.featureService
      .getEnabledFeatures()
      .subscribe((features) =>
        this.updateView(features.includes(this.feature()))
      );
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateView(shouldCreate: boolean): void {
    if (shouldCreate) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
```

## The MSW Endpoint:

I use Mock Service Workers during development. The handler for this looks like this (`/src/mocks/features-handler.ts`):

```typescript
import { http, HttpResponse } from "msw";

const features = ["golf"];
const handlers = [
  http.get("/api/features", () => {
    return HttpResponse.json(features);
  }),
];

export default handlers;
```

And expose it from the `handlers.ts`:

```typescript
import features from "./features-handler";
export const handlers = [...features];
```

## Examples of Usage

### In a Route:

```typescript
import { Routes } from "@angular/router";
import { GolfComponent } from "./golf.page";
import { canMatchFeature } from "../../feature-management/feature.guard";

export const GOLF_ROUTES: Routes = [
  {
    path: "golf",
    component: GolfComponent,
    canMatch: [canMatchFeature("golf")],
  },
];
```

### Using the Structural Directive:

```typescript
   <li *feature="'golf'"><a routerLink="/golf">Golf</a></li>
```
