import { DatePipe, JsonPipe } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
} from '@angular/core';
import { OutboxStore } from '@outbox';

@Component({
  selector: 'app-dead-letter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, JsonPipe],
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
                }
                @case ('deletion') {
                  <span>deleting item </span> <span>{{ $any(d.body) }}</span>
                }
                @case ('update') {
                  <span>updating </span> <span>{{ $any(d.body).name }}</span>
                }
              }
              <span>: {{ d.message }}</span>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class DeadLetterComponent {
  store = inject(OutboxStore);

  deadLetters = computed(() => {
    return this.store
      .deadLetters()
      .filter((d) => d.name === 'products')
      .sort((a, b) => {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
  });
}
