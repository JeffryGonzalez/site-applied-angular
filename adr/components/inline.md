# Prefer Inline Templates and Inline Styles

This is not a hard rule, but is included here because using inline styles and
inline templates in your components is a good way to push developers to a best
practice, namely **Components Should Be Small and Focused**.

Using the `template:` property instead of the `templateUrl:` property (and
associated properties for styles) within components essentially does the same
thing. If you use URLs, during compilation, those resources are _inlined_ in
your code.

The common argument against inline templates (and styles) is that they become too long and unweildy in the component source code file. We want to _intentionally_ cause this friction because when a template becomes too long, our response should be to extract smaller child components. Putting a huge template in a separate source code file (the `thing.component.html` file) is sweeping the problem under the rug.

## An Example

```typescript
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterLink } from "@angular/router";
import { FeatureDirective } from "@shared";

@Component({
  selector: "app-nav-bar",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FeatureDirective],
  template: `
    // [!code focus:13]
    <div class="navbar bg-base-100">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl" routerLink="/">Applied Angular</a>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li *feature="'wip'"><a routerLink="demos">Demos</a></li>
          <li><a routerLink="banking">Banking</a></li>
          <li><a routerLink="counter">Counter</a></li>
        </ul>
      </div>
    </div>
  `,
  styles: ``, // [!code focus]
})
export class NavBarComponent {}
```
