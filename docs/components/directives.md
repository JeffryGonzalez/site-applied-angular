# Angular Directives

Directives are sort of like Components in that they allow you to extend the vocabulary of HTML, but with directives they are added as an *attribute* to an element (or component selector).

In other words, where Components are meant to create brand-new things (abstractions), Directives augment existing things.

There are two basic types of Directives in Angular, Attribute Directives, and Structural Directives.

Structural directives are more powerful, and there is a lot more to learn about them than I will show in this class, as they are most often used as part of a library that you will share with others. As this class is about applying Angular for application development, we will use mostly attribute directives, and touch on structural directives only briefly.

## Attribute Directives

HTML uses directives on elements, for example:

```HTML
<h1 class="text-3xl font-bold" id="headingOne">Hello, World</h1>
```

This example element, an `h1`, has two attributes: `class`, and `id`. Those are defined by the HTML media type.

::: tip Attributes Can only Appear Once Per Element. 
If they have a value, their value must be quoted.
:::

Let's imagine we have an Angular component with a template like this:

```HTML
    <div>
      <button class="btn btn-lg btn-primary" 
        (click)="service.increment()">
        -
      </button>
      <span>{{ service.current() }}</span>
      <button class="btn btn-lg btn-secondary" 
        (click)="service.decrement()">
        +
      </button>
    </div>
    <div>
      <button
        (click)="service.reset()"
        class="btn btn-md btn-warning"
        [disabled]="atBeginning()"
      >
        Reset
      </button>
    </div>
```

When it renders, it looks something like this:

![Buttons on a Screen](/media/buttons.png)

Gorgeous, I know. I'm using [DaisyUi](https://daisyui.com) with Tailwind for my CSS, largely because I'm *bad* at CSS. More accurately, I'm bad at *design*. I can do it, but it isn't really economical for me. What someone with some talent can do in a short amount of time, I can do a slightly crappy version in much more time. But I digress.

In building an application, you will either be *starting* with a "design system" that you have to adhere to (for "corporate branding", "accessibility", etc.) or you will be creating one as you go. Most likely it will be a combination of both.

You *could* create a special `<app-button />` component, but that way leads to madness. Turns out UI elements are hard to abstract that way. But maybe you try, and for this you'd have to create multiple component inputs and outputs. Or maybe different *kinds* of buttons. It explodes fast.

We *could* just define some common CSS class definitions, and *sometimes* that is the right move, but it is sort of the wrong abstraction, IMO. We use CSS to define how something *appears*, but we can use Directives to step it up a notch and say what something *is*.  Because the "is-ness" of something in UI tends to change. Our button might start life as just a button, but maybe it grows us to be something more, like a thing that *also* sends telemetry data to an service for RUM ("Real User Monitoring"), or maybe the button should appear (or not appear!) based on some "ambient" requirement, like Authentication.

With UI, we want to *start* with consistency. Then "tweak" as needed for UX, or just plain style. 

For the example above, I could *identify* each of those buttons as a "thing" (an `appButton`) that gives them a consistent look and feel. (the code for the attribute is forthcoming).

If I update that template to something like this:

```HTML
<div>
  <button appButton (click)="service.increment()">-</button>
  <span>{{ service.current() }}</span>
  <button appButton (click)="service.decrement()">+</button>
</div>
<div>
  <button (click)="service.reset()" appButton [disabled]="atBeginning()">
    Reset
  </button>
</div>

```

Notice I removed the classes and replaced them with an `appButton` directive.

I created a directive that looks like this:

```typescript

@Directive({
    standalone: true,
    selector: 'button[appButton]'
})
export class ButtonDirective implements OnInit {

    constructor(private el: ElementRef<HTMLButtonElement>) {}

    ngOnInit(): void {
        this.el.nativeElement.classList.add(['btn', 'btn-md', 'btn-primary']);
    }
}
```

Notice the selector (`button[appButton]`). That is reusing CSS selector language to say that this attribute (`appButton`) can only be applied to elements of type `button`. Might not be the *best* move in the long run (e.g. we may want to style a link like a button), but it is good for now.

The constructor takes an `ElementRef<HtmlButtonElement>` that will get a reference to the `button` we apply this to. We implement `OnInit`, so that when the template is displayed, the set of classes are added to the element.

In the class we will explore more advanced ways to create a UI library using attribute Directives.


## A More Extensive Example

Moving the directive to the `src/app/shared` folder structure.


