import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ProductsApi } from './product-api';

@Component({
  selector: 'app-outbox2-outbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: ` <p>Outbox 2</p> `,
  styles: ``,
})
export class OutboxComponent {
  service = inject(ProductsApi);

  constructor() {
    this.service.getProducts().subscribe((products) => {
      console.log(products);
    });
  }
}
