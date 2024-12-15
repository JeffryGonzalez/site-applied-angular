# Directives

For most Angular developers, creating attribute-based directives can open a wealth of ways to coalesce application functionality and design.

Attribute directives are for *cross-cutting* concernss in your application or within your feature. You can use them to standardize the appearance of commonly used UI "widgets" acrross you application, 
and they almost always provide more flexibility for the developers (including yourself) using them than is often found with components.

The following code example shows an example directive that has been elevated to the `shared` folder of an application, and provides the beginnings for an application *design system*.

You will create a folder structure like this:

```
src
   app
      shared
        index.ts
        ui
          button
            button.directive.ts
          index.ts
          ui.types.ts
```

## The `src/app/shared/ui` folder:

::: code-group

```typescript [index.ts]
export * from './button/button.directive';
```

```typescript [ui.types.ts]
/* eslint-disable @typescript-eslint/no-unused-vars */
const UI_KINDS = [
  'primary',
  'secondary',
  'accent',
  'error',
  'info',
  'success',
  'warning',
] as const;

const UI_SIZES = ['x-large', 'large', 'medium', 'small', 'x-small'] as const;

const UI_SHAPES = ['default', 'square', 'circle'];

export type UiKinds = (typeof UI_KINDS)[number];
export type UiSizes = (typeof UI_SIZES)[number];
export type UIShapes = (typeof UI_SHAPES)[number];
```

:::

## The `src/app/shared/ui/button` folder:

```typescript [button.directive.ts]
import {
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { UiKinds, UIShapes, UiSizes } from '../ui.types';

type ButtonKinds = Exclude<UiKinds, 'info' | 'success' | 'warning'>;
const KIND: Record<ButtonKinds, string[]> = {
  primary: ['btn-primary'],
  secondary: ['btn-secondary'],
  accent: ['btn-accent'],
  error: ['btn-error'],
};
type ButtonSizes = Exclude<UiSizes, 'x-large' | 'x-small'>;
export const SIZE: Record<ButtonSizes, string[]> = {
  large: ['btn-large'],
  medium: ['btn-medium'],
  small: ['btn-sm'],
};

type ButtonShapes = UIShapes;
export const SHAPE: Record<ButtonShapes, string[]> = {
  default: [],
  square: ['btn-square'],
  circle: ['btn-circle'],
};

const base = ['btn'];

@Directive({
  selector: 'button[appButton]',
})
export class ButtonDirective {
  kind = input<ButtonKinds>('primary');
  shape = input<ButtonShapes>('default');
  size = input<ButtonSizes>('medium');

  el: ElementRef<HTMLButtonElement> = inject(ElementRef<HTMLButtonElement>);

  constructor() {
    const el = this.el.nativeElement;
    const originalClasses = el.classList.value
      ? el.classList?.value.split(' ')
      : [];

    effect(() => {
      el.className = '';
      const all = [
        ...base,
        ...originalClasses,
        ...KIND[this.kind()],
        ...SIZE[this.size()],
        ...SHAPE[this.shape()],
      ];
      console.log(all);

      el.classList.add(...all);
    });
  }
  @HostListener('click') handleClick() {
    // an example of how to handle an event
    console.log(this.el.nativeElement.innerText + ' was clicked');
  }
}

```

## Example of Using This Directive in Your Component

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