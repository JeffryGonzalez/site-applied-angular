# Signal In a Service

We can create a service to encapsulate the state for the counter and the history.
```typescript
import { Injectable, effect, signal } from '@angular/core';
type CounterHistoryOp = 'increment' | 'decrement' | 'reset';
export type CounterHistoryItem = {
  before: number;
  after: number;
  op: CounterHistoryOp;
  when: string;
};
@Injectable({ providedIn: 'root' })
export class CounterService {
  private readonly _current = signal(0);
  private readonly _history = signal<CounterHistoryItem[]>([]);

  constructor() {
    const saved = localStorage.getItem('current');
    if (saved != null) {
      this._current.set(+saved);
    }
    effect(() => {
      localStorage.setItem('current', this.current().toString());
    });
  }

  get current() {
    return this._current.asReadonly();
  }

  get history() {
    return this._history.asReadonly();
  }

  increment() {
    this.doOp('increment', n => n + 1);
  }
  decrement() {
    this.doOp('decrement', n => n - 1);
  }
  reset() {
    this.doOp('reset', _=> 0)
  }

  clearHistory() {
    this._history.set([]);
  }
  private doOp(op: CounterHistoryOp, f: (c: number) => number) {
    const before = this.current();
    this._current.update(f);
    this._history.update((h) => [
      { before, op, after: this.current(), when: new Date().toISOString() },
      ...h,
    ]);
  }
  

}

```

This simplifies both the counter and decouples the history component.

```typescript
import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { CounterService } from './counter.service';
import { ListComponent } from './list.component';

@Component({
  selector: 'app-signals-one',
  standalone: true,
  template: `
    <div>
      <button class="btn btn-lg btn-ghost"
        (click)="service.increment()">-</button>

      <span>{{ service.current() }}</span>
      <button class="btn btn-lg btn-ghost"
        (click)="service.decrement()">+</button>
    </div>
    <div>
      <button
        (click)="service.reset()"
        class="btn btn-lg btn-warning"
        [disabled]="atBeginning()"
      >
        Reset
      </button>
    </div>
    <div>
      @if(hasHistory()) {
      <app-list 
      headerMessage="Your History"
    />
      }
    </div>
  `,
  styles: ``,
  imports: [DatePipe, ListComponent],
})
export class SignalsOneComponent {
  service = inject(CounterService);

  atBeginning = computed(() => this.service.current() === 0);
  hasHistory = computed(() => this.service.history().length > 0);


}

```

```typescript
import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { CounterService } from './counter.service';

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
        <button (click)="service.clearHistory()" class="btn btn-secondary">
          Clear History
        </button>
      </div>
  `,
  styles: ``
})
export class ListComponent {
  readonly service = inject(CounterService);
  history = this.service.history;
  headerMessage = input('Counter History');
}

```


