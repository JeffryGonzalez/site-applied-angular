# Component State with Signals

Components sometimes have their own state, and sometimes they receive that state from their parent component
or receive it from a service.

The document object model (DOM) has no way of tracking state or changes to that state over time. It is up to the programmer
to keep the DOM (what the user sees on the screen, ultimately) in sync with the state in your application.

Frameworks and libraries like Angular have ways of helping with this. And almost *all* of them change how it should be done
frequently. Part of the reason for this is that we keep building bigger and more complex applications and each of the ways
this has been done, almost exclusively, has been some kind of "hack". It's a *hack* because, as I said above, the browser can't do it.

The predecessor to Angular, AngularJS was popular because it had was looked like an intuitive way of dealing with state. We used *binding expressions* very much like what you might see in an Angular template today, and they "magically" stayed in sync with state.

The way it was implemented, though, was a bit of a mess. It didn't scale well. It was one of the (many) reasons the Angular team decided
to do a rewrite (originally called "Angular 2", now just "Angular"). They changed the way changes were detected behind the scenes by implementing a "virtual DOM" that could be checked against the state in each change detection "cycle". They also did some things that in retrospect seemed obvious - like not worrying about state that isn't actually displayed in the component.

They did some "monkey patching" of some of the internal browser APIs that might change the state of our application (things like HTTP requests completing, timers, etc.) to make that hook into the change detection. (This is the much maligned (*now*) `zone.js` library).

It allowed us to get *much farther*, performance-wise, than we had with AngularJS, but we started to outgrow that as well.

The Angular team, early on, leaned into the idea of **Observables**, in particular with the RXJS library. Observables are one of many 
to deal with asynchronicity in front end applications. Many of us used lots of tools and patterns from the RXJS library to help with
performance and keeping application state accurate. We will use RXJS for *some things*, but it is a pretty heavy-handed set of tools to just keep the UI up to date across your application.

## Enter Signals

For the last several versions (and continuing on from the time of this writing), the Angular team has been moving towards the abstraction of `Signals` for managing state in your application.

Signals turn state management on it's head a bit. Any state that your component needs, for example, is encapsulated inside an object (called, unsurprisingly, a 'Signal'). It tracks it's own state, and when any code (for example, our template) needs to be updated, it will signal that the value needs to be reevaluated.

Signals are created using the `signal` function from '@angular/core'.

There is also a `computed` function that allows you to project the value of a signal (or multiple signals) into a new value, and that value will be updated anytime *any* of the signals in the compute expression are signaled. 

Sometimes you want something to happen every time a signal changes that is not something that creates a new signal (like `computed`).
For this you can use the `effect` function.

```typescript
import { DatePipe, JsonPipe } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
type CounterHistoryOp = 'increment' | 'decrement' | 'reset';
type CounterHistoryItem = {
  before: number;
  after: number;
  op: CounterHistoryOp;
  when: string;
};
@Component({
  selector: 'app-signals-one',
  standalone: true,
  imports: [DatePipe],
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
      <div class="overflow-x-auto">
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
        <button (click)="history.set([])" class="btn btn-secondary">
          Clear History
        </button>
      </div>
      }
    </div>
  `,
  styles: ``,
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
```
```
