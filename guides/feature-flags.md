# Using Feature Flags

Using feature flags or feature toggles is nearly a necessity for working in user interface.

There is a _lot_ you can do with them in terms of patterns like continuous integration / continuous delivery, customizing the application for certain segments of your users (e.g. a/b testing, geolocation, etc.). All of that requires a server-side component that will dynamically provide the appropriate values for your feature toggles.

Here, I'm enabling that, but mostly using them to allow us to conditionally allow features to be displayed to the user - so only the client side, and only really thinking of this for continuous integration scenarios.

## The Feature Flags Store

```ts
import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { tapResponse } from "@ngrx/operators";
import { patchState, signalStore, withHooks, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap } from "rxjs";
import { NavBarItem } from "../components/nav-bar/types";
import { ALWAYS_LINKS, FeatureFlags, linkSetup } from "./features";

type FeatureFlagState = {
  features: FeatureFlags;
  links: NavBarItem[];
};

const initialState: FeatureFlagState = {
  features: {
    learningEnabled: false,
  },
  links: ALWAYS_LINKS,
};

export const FeatureStore = signalStore(
  withState(initialState),

  withHooks((store) => {
    const client = inject(HttpClient);
    return {
      onInit: rxMethod<void>(
        pipe(
          switchMap(() =>
            client
              .get<FeatureFlags>("http://my.features.com/applied-angular")
              .pipe(
                tapResponse(
                  (flags) =>
                    patchState(store, {
                      features: flags,
                      links: [...store.links(), ...getLinks(flags)],
                    }),
                  (error) => console.error(error)
                )
              )
          )
        )
      ),
    };
  })
);

function getLinks(features: FeatureFlags): NavBarItem[] {
  return Object.keys(features).reduce((links: NavBarItem[], key) => {
    if (features[key as keyof typeof features] === true) {
      links.push(linkSetup[key as keyof FeatureFlags]);
    }
    return links;
  }, []);
}
```

## The Configuration

```ts
import { NavBarItem } from "../components/nav-bar/types";

// these are the links that will always be displayed, they are not behind a feature toggle.
export const ALWAYS_LINKS: NavBarItem[] = [
  {
    text: "Home",
    href: "/",
  },
];

// These are the flags you are expecting from the feature flag service.
export type FeatureFlags = {
  learningEnabled: boolean;
};

// If a particular feature is enabled, add a link to the nav bar.
export const linkSetup: Record<keyof FeatureFlags, NavBarItem> = {
  learningEnabled: {
    text: "Stuff From Class",
    href: "/learning",
  },
};
```

## A Route Guard

```ts
function featureEnabledGuard(feature: keyof FeatureFlags) {
  return () => {
    return inject(FeatureStore).features()[feature];
  };
}
```

Route Guard Usage:

```ts
canActivate: [featureEnabledGuard('learningEnabled')],
```

### Creating a Directive

```ts
import {
  Directive,
  effect,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";
import { FeatureFlags } from "./features";
import { FeatureStore } from "./features.store";

@Directive({
  standalone: true,
  selector: "[appFeatureFlag]",
})
export class FeatureFlagDirective {
  store = inject(FeatureStore);
  appFeatureFlag = input.required<keyof FeatureFlags>();
  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<unknown>
  ) {
    effect(() => {
      if (this.store.features()[this.appFeatureFlag()]) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
```

Usage:

```ts
    <div *appFeatureFlag="'learningEnabled'">
      <p>Remember, we are just learning</p>
    </div>
```
