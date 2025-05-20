import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-anti-patterns',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: ` <p class="text-xl font-bold">Ephemeral User State</p>
    <div class="flex flex-row gap-4 p-2">
      <a
        [routerLinkActive]="['uppercase']"
        routerLink="pessimistic"
        class="link"
        >Pessimistic</a
      >
      <a [routerLinkActive]="['uppercase']" routerLink="optimistic" class="link"
        >Optimistic
      </a>
    </div>
    <router-outlet />`,
  styles: ``,
})
export class AntiPatternsComponent {}
