# Use Signal-Based State

Whenever possible in components, all state (variables within the component class) should be encapsulated in Signals (or computed values, or resources).

State within a component _must_ not be tracked variables (in other words, not a signal, a signal input, or an observable).

An exception would be the use of Observables, for things like Reactive Forms, or services that return Observables. However these should be considered a "code smell" now, and eventually, as Angular advances, moved to signal-based alternatives.

## An Example

```typescript
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
} from "@angular/core";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <p>Current is {{ current() }}</p>
    <button (click)="increment()" class="btn">Increment</button>
    @if(isEven()) {
    <div role="alert" class="alert alert-info">
      <span>That is an even number</span>
    </div>
    } @else {
    <p>That isn't an even number</p>
    }
  `,
  styles: ``,
})
export class ChangeDetectionComponent {
  current = signal(1);

  isEven = computed(() => this.current() % 2 === 0);

  increment() {
    this.current.update((c) => c + 1);
  }
}
```
