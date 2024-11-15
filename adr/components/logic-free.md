# Prefer Logic-Free Components

Complex logic inside of the component class is brittle, difficult to test, and leads to components that are hard to deconstruct into smaller more manageable (and sometimes resusable) components.

The ideal is a component that has only a single line of code that imports a Signal-based service (we prefer the NGRX SignalStore). The template directly references this store. Templates are the "imperative shell" of our Angular applications - in other words, decisions (`@if()`, `@switch()`) and loops (`@for()`) are fine here.

## An Example

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { DecrementButtonDirective, IncrementButtonDirective } from "@shared";
import { CounterStore } from "../services/counter.store";

@Component({
  selector: "app-ui",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IncrementButtonDirective, DecrementButtonDirective],
  template: `
    <div data-testid="counter-feature-ui">
      <button
        [disabled]="store.decrementDisabled()"
        (click)="store.decrement()"
        appDecrementButton
      >
        -
      </button>
      <span data-testid="current">{{ store.current() }}</span>
      <button appIncrementButton (click)="store.increment()">+</button>
    </div>

    <div data-testid="fizzBuzz">{{ store.fizzBuzz() }}</div>
  `,
  styles: ``,
})
export class UiComponent {
  store = inject(CounterStore);
}
```
