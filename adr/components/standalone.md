# Use Standalone Components

Historically, at least since soon after Angular 2 shipped, components had to be
part of an abstraction called an _Angular Module_. The `NgModule` would declare
all the related components, as well as services, for an area of your
application. Each Angular application would have at least one `NgModule`
(usually defined in the `app.module.ts`). Other modules could be created to
encompass other semi-isolated

They would be imported into the module's list of components and would be
ambiently available to every other component that was part of that module in
that the component's template would recognize the imported components
_selector_. The "_ambiently available_" part was the magic. In a properly
configured Angular application, the "on-ramp" was easier - you didn't have to
remember to include imported components, directives, etc. in _each_ component.

There are a couple of problems with this approach, however. "Magic" always comes
with a price. A technical issue is that using modules does not allow for a fine
level of "tree-shaking" when compiling, resulting in larger bundle sizes. A
common practice for many Angular developers was to create "Single Component
Modules" to allow for things like lazy-loading.

The problems were most in-the-face of developers when writing tests for
components. You simply could not look at the component source code and determine
the dependencies. You'd also have to look at the module.

_Modern_ Angular (v16) introduced the idea of _Standalone Components_. These
components do _not_ belong to a particular module.

Standalone components declare all their dependencies, handle lazy-loading
appropriately, and are much cleaner and easier to work with, despite a slight
increase in "import" noise.

## An Example

```typescript
import { Component } from "@angular/core";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { DemosComponent } from "./demos/demos.component";
import { RouterOutlet } from "@angular/router";
import { FeatureDirective } from "@shared";

@Component({
  selector: "app-root",
  standalone: true, // as of Angular 19, true is the default.
  template: `
    <app-nav-bar />
    <div *feature="'home-page-content'">This is something I'm working on.</div>
    <main class="container mx-auto">
      <router-outlet />
    </main>
  `,
  styles: [],
  imports: [NavBarComponent, DemosComponent, RouterOutlet, FeatureDirective],
})
export class AppComponent {}
```
