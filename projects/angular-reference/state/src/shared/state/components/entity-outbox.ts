import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
type EntityList<T> = {
  data: {
    item: T;
    meta: {
      isDeleting: boolean;
      isUpdating: boolean;
      update: T | undefined;
    };
  }[];
  isAdding: boolean;
  additions: Omit<T, 'id'>[];
};
@Component({
  selector: 'app-entity-outbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    <div>
      <ng-template #exampleTemplate>
        <p>This is an example template</p>
      </ng-template>
      <ng-container *ngTemplateOutlet="exampleTemplate"></ng-container>
    </div>
  `,
  styles: ``,
})
export class EntityOutboxComponent<T> {
  entityList = input.required<EntityList<T>>();
}
