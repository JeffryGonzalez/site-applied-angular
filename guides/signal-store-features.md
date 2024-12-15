# Signal Store Features

::: code-group

```typescript [counter.store.ts]
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ByValue, setCountBy, withCountingBy } from './by.feature';

export const CounterStore = signalStore(
  withCountingBy(),
  withState({
    current: 0,
  }),
  withMethods((store) => {
    return {
      increment: () =>
        patchState(store, { current: store.current() + store.by() }),
      decrement: () =>
        patchState(store, { current: store.current() - store.by() }),
      changeCountBy: (by: ByValue) => patchState(store, setCountBy(by)),
    };
  }),
  withComputed((store) => {
    return {
      decrementDisabled: computed(() => store.current() - store.by() < 0),

      fizzBuzz: computed(() => {
        const current = store.current();
        if (current === 0) {
          return '';
        }
        if (current % 3 === 0 && current % 5 === 0) {
          return 'FizzBuzz';
        }
        if (current % 3 === 0) {
          return 'Fizz';
        }
        if (current % 5 === 0) {
          return 'Buzz';
        }
        return '';
      }),
    };
  }),
  withHooks({
    onInit(store) {
      const saved = localStorage.getItem('counter');
      if (saved !== null) {
        const state = JSON.parse(saved) as unknown as {
          current: number;
          by: ByValue;
        };
        patchState(store, { current: state.current }, setCountBy(state.by));
      }
      watchState(store, (state) => {
        localStorage.setItem('counter', JSON.stringify(state));
      });
    },
  }),
);

```

```typescript [by.feature.ts]
import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

const BY_VALUES = [1, 3, 5] as const;

export type ByValue = (typeof BY_VALUES)[number];
type ByState = {
  by: ByValue;
};
export function withCountingBy() {
  return signalStoreFeature(
    withState<ByState>({
      by: 1,
    }),
    withComputed(() => {
      return {
        byValues: computed(() => BY_VALUES),
      };
    }),
  );
}

export function setCountBy(by: ByValue): ByState {
  return { by };
}
```

:::