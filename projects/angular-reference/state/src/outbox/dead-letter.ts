import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { OutboxStore } from '@outbox';
import { ProductsStore } from './products-store';

@Component({
  selector: 'app-dead-letter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    @if (deadLetters().length > 0) {
      <div class="alert alert-error">
        <div class="flex flex-col gap-2">
          @for (d of this.deadLetters(); track d.id) {
            <div>
              <span>Error while </span>
              @switch (d.kind) {
                @case ('addition') {
                  <span>adding</span> <span>{{ $any(d.body).name }}</span>
                  <span>: {{ d.message }}</span>
                }
              }
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class DeadLetterComponent {
  store = inject(ProductsStore);

  deadLetters = computed(() => {
    return this.store.outboxAugmentedList().additionErrors;
  });
}
