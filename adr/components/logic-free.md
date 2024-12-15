# Prefer Logic-Free Components

Complex logic inside of the component class is brittle, difficult to test, and leads to components that are hard to deconstruct into smaller more manageable (and sometimes resusable) components.

The ideal is a component that has only a single line of code that imports a Signal-based service (we prefer the NGRX SignalStore). The template directly references this store. Templates are the "imperative shell" of our Angular applications - in other words, decisions (`@if()`, `@switch()`) and loops (`@for()`) are fine here.

## An Example

```typescript
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CounterStore } from '../services/counter.store';
import { ButtonDirective } from '@shared';

@Component({
  selector: 'app-counter-ui',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective],
  template: `
    <div class="mt-12 ">
      <button
        class="mr-4 btn-square"
        [disabled]="store.decrementDisabled()"
        (click)="store.decrement()"
        appButton
        shape="circle"
        kind="secondary"
      >
        -
      </button>
      <span data-testid="current">{{ store.current() }}</span>
      <button
        class="ml-4"
        (click)="store.increment()"
        appButton
        shape="circle"
        [kind]="store.current() > 20 ? 'primary' : 'error'"
      >
        +
      </button>
    </div>
    <div>
      @switch (store.fizzBuzz()) {
        @case ('Fizz') {
          <p class="font-bold text-2xl text-green-400">Fizz</p>
        }
        @case ('Buzz') {
          <p class="font-bold text-2xl text-orange-400">Buzz</p>
        }
        @case ('FizzBuzz') {
          <p class="font-bold text-3xl text-green-800 animate-pulse">
            FIZZBUZZ!
          </p>
        }
      }
    </div>
  `,
  styles: ``,
})
export class UiComponent {
  store = inject(CounterStore);
}

```
