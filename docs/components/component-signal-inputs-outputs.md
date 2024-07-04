# Signal Inputs (and Outputs)

The `input` function allows you to create a signal-based input for your component.

It can allow for required inputs, or optional with a default.

In the following example, `history` is a *required* input, and `headerMessage` is optional.

There is an `output` function for creating outputs, but it is not signal based.

```typescript
import { Component, input, output } from '@angular/core';
import { CounterHistoryItem } from './signals-one.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [DatePipe],
  template: `
      <div class="overflow-x-auto">
        <h2 class="text-2xl font-bold">{{headerMessage()}}</h2>
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th>Op</th>
              <th>Before</th>
              <th>After</th>
              <th>When</th>
            </tr>
          </thead>
          @for(h of history(); track h.when) {
          <tr>
            <td>{{ h.op }}</td>
            <td>{{ h.before }}</td>
            <td>{{ h.after }}</td>
            <td>{{ h.when | date : 'HH:MM:SSS' }}</td>
          </tr>

          }
        </table>
        <button (click)="clearHistory.emit()" class="btn btn-secondary">
          Clear History
        </button>
      </div>
  `,
  styles: ``
})
export class ListComponent {
  history = input.required<CounterHistoryItem[]>(); // [!code highlight] 
  headerMessage = input('Counter History'); // [!code highlight] 
  clearHistory = output(); // [!code highlight]
}

```

Using this from the Counter in the previous example:

```typescript
import { DatePipe, JsonPipe } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { ListComponent } from './list.component';
type CounterHistoryOp = 'increment' | 'decrement' | 'reset';
export type CounterHistoryItem = {
  before: number;
  after: number;
  op: CounterHistoryOp;
  when: string;
};
@Component({
  selector: 'app-signals-one',
  standalone: true,
  template: `
    <div>
      <button class="btn btn-lg btn-ghost" (click)="decrement()">-</button>
      <span>{{ current() }}</span>
      <button class="btn btn-lg btn-ghost" (click)="increment()">+</button>
    </div>
    <div>
      <button
        (click)="reset()"
        class="btn btn-lg btn-warning"
        [disabled]="atBeginning()"
      >
        Reset
      </button>
    </div>
    <div>
      @if(hasHistory()) {
      <app-list  // [!code focus:4]
      [history]="history()" 
      headerMessage="Your History"
      (clearHistory)="history.set([])" />
      }
    </div>
  `,
  styles: ``,
  imports: [DatePipe, ListComponent],
})
export class SignalsOneComponent {
  current = signal(0);
  history = signal<CounterHistoryItem[]>([]);

  constructor() {
    const saved = localStorage.getItem('current');
    if (saved != null) {
      this.current.set(+saved);
    }
    effect(() => {
      localStorage.setItem('current', this.current().toString());
    });
  }

  increment() {
    this.doOp('increment', (n) => n + 1);
  }

  decrement() {
    this.doOp('decrement', (n) => n - 1);
  }

  reset() {
    this.doOp('reset', (_) => 0);
  }

  atBeginning = computed(() => this.current() === 0);
  hasHistory = computed(() => this.history().length > 0);

  private doOp(op: CounterHistoryOp, f: (c: number) => number) {
    const before = this.current();
    this.current.update(f);
    this.history.update((h) => [
      { before, op, after: this.current(), when: new Date().toISOString() },
      ...h,
    ]);
  }
}


```
