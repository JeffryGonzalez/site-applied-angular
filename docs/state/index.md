# State and State Management

All I mean by "state" here is basically "data". We use Angular to create user interface, and user interface is all about creating ways (*affordances*) through which the user can manipulate state.

That sounds really nerdy. But think of a light switch. Light switches are an affordance that you use to turn a light on or a light off. The "state" of the light is probably obvious (if it is dark, the light is off, if it isn't, it's probably on?) but the affordance itself (the switch) *demonstrates* the **current** state by its position. If the toggle is up, the light is probably on, and if the toggle is down, the light is probably off.

> I once rented a place where about half the switches were upside down. Down was on, up, was off. Talk about a way to make an intuitive thing really confusing.

## Levels and Origins of State

The state of an application can be categorized helpfully by thinking of the "spheres" in which it resides, and who or what "owns" that state.

### App State

Think of an application you commonly use. Something like Visual Studio Code. You might have a few tabs open, your cursor might be in a specific position, etc. One of the things I like about VSCode is that when you close it, and open it again, it remembers exactly where you were. The same directory is open, the same tabs, etc.

I haven't looked at the source code for this part of VSCode, but I'd guess there is some mechanism that *persists* some of that state in an ongoing way. Just writes it out somewhere in you user data folder. When you start it up again, it reads that data (if it exists) and puts your application back in that familiar, comfortable state.

When building apps that run in a browser, the primary (but not only) mechanism for this is the URL. The URL contains information that allows the application (either the Angular application running in our browser, or the server processing the HTTP request) to recreate the state the user should see. If I'm creating a Christmas wish-list, I guess I could just have "https://amazon.com", but more likely I'm going to have links to specific things I'd like. If you follow the link, the server shows the "state" I had it in when I created the link.

::: info The Primary Source of App State **Must** be the URL.
A required set of tests for your application is that the application can be "booted" by going to any URL without breaking. If I'm using your application, and I create a bookmark to a specific portion of your application, and then close the browser and come back later, does it "recreate" the state where I left off?
:::

For example, if you follow this URL: [https://github.com/angular/angular/blob/main/packages/router/src/create_router_state.ts#L20](https://github.com/angular/angular/blob/main/packages/router/src/create_router_state.ts#L20), it will take you to *exactly* what I was seeing when I created that link, including the line of code I wanted to bring to your attention.

If you look at the URL, after the *scheme* (`https`), the *authority* (or origin, or server) `github.com`, there is a *path* to a specific *resource* (`/angular/angular/blob/main/packages/router/src/create_router_state.ts`). Then there is that weird `#L20` thing tacked on to the end. That is called an **anchor**, and it is usually ignored by the server, but the client (browser, your JavaScript) can read that to navigate to a specific point in that resource.

Another thing you'll see in a URL that is about transmitting state is a *query string*. For example, if you do a search on Google (if you don't know, it's a web search engine, sort of like Bing), there is a resource called `search`, but it requires you to tell it what you are searching for. So if you go to [https://google.com/search?q=tacos](https://google.com/search?q=tacos), that thing after the question mark is a *query string*, which is a set of names and values. The Google search resource *needs* a query string argument called " q " (*query*? I don't know. Wasn't there), with a value that it will *filter* all of their possible search results to. I checked, if you go to that URL and leave out the `q=` parameter, it *does not* return *every* result it has. That'd be crazy. It just redirects you. 

You can imagine, though, that maybe you are writing an application that displays a list of video games in your collection. Let's say that it "lives" at [https://localhost:4200/games](https://localhost:4200/games). (note, don't try to follow that URL, I own the `localhost` domain. You *do not* want to see what is there! :smile:).

Maybe you have a little dropdown or other affordance that lets the user filter the list by the platform the game runs on (XBox, PlayStation, Switch, Steam, etc.). If the user changes that value, the list of games displayed changes to reflect that bit of *user state*. If the user refreshes the page, does it *remember* that filter?

Does it *have* to? Not necessarily, but it would *stink* if everything I followed a link to Amazon.com it just took me to the home page and made me search again. In other words, embracing URLs as (a | the) primary source of application state is a nice thing to do. So, you could do something like, when the user switches the filter, you update the address displayed to indicate the state, and then when you load the application, you look for that value, and set the filter accordingly.

Here is an example:

```typescript
import { NgClass } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { injectDestroy } from 'ngxtension/inject-destroy';
import { map, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-hateos',
  standalone: true,
  imports: [RouterLink, NgClass],
  template: `
    <p>Selected Game: {{ selectedGame() }}</p>
    <div>
      @if(platform() !== null) {
      <a
        [routerLink]="['/demos/hateos']"
        [queryParams]="{ platform: null }"
        class="btn btn-sm btn-success"
        >Filtering on {{ platform() }}. Reset?</a
      >
      }
    </div>
    <div class="flex">
      @for(game of gamelist(); track game.id) {
      <div
        class="card bg-base-400 w-96 shadow-xl m-4"
        [ngClass]="{ 'border-4': selectedGame() === game.id }"
      >
        <div class="card-body">
          <h2 class="card-title link">
            <a
              routerLink="."
              [fragment]="game.id"
              queryParamsHandling="merge"
              >{{ game.title }}</a
            >
          </h2>
          <div class="card-actions justify-end">
            <div class="flex gap-2">
              @for(platform of game.platforms; track platform) {
              <a
                [routerLink]="['/demos/hateos']"
                [queryParams]="{platform}"
                class="badge badge-secondary"
                >{{ platform }}</a
              >

              }
            </div>
          </div>
        </div>
      </div>
      } @empty {
      <div class="alert alert-info">
        <p>There are no games the {{ platform() }} platform.</p>
      </div>
      }
    </div>
  `,
  styles: ``,
})
export class HateosComponent implements OnInit {
  #destroy$ = injectDestroy();
  ngOnInit(): void {
    this.route.fragment
      .pipe(
        tap((f) => {
          const frag = f as unknown as string | null;
          this.selectedGame.set(frag);
        }),
        takeUntil(this.#destroy$)
      )
      .subscribe();
    this.route.queryParams
      .pipe(
        map((f) => f['platform']),
        tap((f) => {
          if (!f) {
            this.platform.set(null);
          } else {
            this.platform.set(f);
          }
        }),
        takeUntil(this.#destroy$)
      )
      .subscribe();
  }
  route = inject(ActivatedRoute);
  #games = signal([
    {
      id: '1',
      title: 'Destiny 2',
      platforms: ['PlayStation', 'XBox', 'Steam'],
    },
    { id: '2', title: 'Helldivers 2', platforms: ['Playstation', 'Steam'] },
    { id: '3', title: 'Stray', platforms: ['XBox'] },
  ]);

  gamelist = computed(() => {
    if (this.platform() === null) {
      return this.#games();
    } else {
      return this.#games().filter((g) =>
        g.platforms.some((p) => p === this.platform())
      );
    }
  });

  platform = signal<string | null>(null);
  selectedGame = signal<string | null>(null);
  setPlatform(platform: string | null) {
    this.platform.set(platform);
  }
}

 ```




If you try the example, you might notice that the querystring parameter is lost if you navigate away and then come back again. It *will* preserve if you use the back and forward button, since it is in your browser history.


