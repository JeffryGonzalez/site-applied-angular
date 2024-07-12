# What You Need To Build Apps

The most important thing you need to build an application no class can give you. Your primary job, your "essential task", 
meaning the thing you start with, is "Fashioning the complex conceptual structures that compose the abstract software entity".

What the heck does that mean? You are *applying* Angular (a pretty general purpose framework) for building something *specific*.

You *have* to know what that specific thing is before you write a line of code. And it can't be super general. You really have to think about this some. What we do in programming is create representations in code of these "complex conceptual structures".

You might be building an application that let's employees sign up for vacations. Or a shopping cart for an e-commerce application, or an application that steps the user through the process of filing for divorce. *That* is the hard part of software development, and the essential task: Knowing what those things mean. As software developers our job is to create models of complex things to make them *legible* and workable. 

"I need an app that lets users change appointments they have scheduled".

To a normal human being that is a reasonable sentence, to a good developer that is a *huge can of worms*. "I have *so many questions* here!" you might be thinking. Or you should be thinking.

Importantly, this *doesn't* mean that you should spend three months *designing this*, filling white boards, using UML, etc. until you have it *just right*. That doesn't work. Never did. Turns out the only way to validate a design is to build the application, and ask your code lots of "questions" as you do it. If you start work by saying "Give me an example of a user, give me an example of a schedule, etc." then all you are going to be doing is barfing other application's complexity on your user.

Please consider building every user interface by pretending it is the only code in the world. Start with what you want the experience to be, and then worry about how we are going to do this "for real". 

This is what some people call a "prototype", but the problem with that is that when a lot of people hear this term they think what you mean is you are going to spend a long time creating something that isn't really going to be used. What I suggest is you use a very *literal* definition of the word "prototype" in your thinking.

- "Proto" means before, or ahead of time.
- "Type" means (here) "classification", "category", "thingies". Or "fashioning the complex conceptual structures that compose the abstract entity".

And you *find* or *fashion* those by writing code. But don't take a dependency on *anyone else's* definitions. 

This is a process that feels really nice, really organic, but is hard to put in writing. But I will point it out all the time as we write our code as part of this class. What I want to warn against is any sense you might have that the "way he is writing code in class is different than how I do it simply because he is just trying to explain this.". It is fine if you have a different technique than I do. I think mine is the right one. I'll argue with you if you want. But how I write code in class is how I feel you should write your code.

## Step 1: Fashion Your Complex Conceptual Structures That Compose the Abstract Software Entity (the "Model")

This is where you start, and you start it by writing code. And I'll show you what I mean. For lack of a better term, and because saying "Complex Conceptual Structures that Compose the Abstract Software Entity" is a mouthful, we'll just call this our "Model". 

I will just say that if you skip this step, you *can* write applications. You can clock out. But you will end up with a mess that nobody wants to touch, makes no sense, and is an absolute *hell* to maintain and work in. Eventually you will convince the business that you did such a bad job, it's time for a rewrite. Or maybe just a "refactoring sprint or two". Good luck.


## Step 2: Map Those To Your Dependency

Let's just assume you read all that stuff in the [Why Angular](./applied) document, and you have decided that, yes, we need to build an Angular application. Your code is now dependent on Angular. It's sort of a deal with the devil. You are in their world now. Your Model has to be expressed through this.

### The Application

The thing that runs in the browser. This is something that is delivered by HTTP when the user requests the HTML where our app lives. There will be a link in that HTML that the browser will download and run that start our application. This is handled through the build process, which we will review in our course.

The important bits here are, while maybe obvious, are worth enumerating:

- Your code is running in the browser. Not at a server. 
- There is *no* concurrency in an Angular app. What I mean is that there is always just one "user", the user running the app. This is important, because on server-side applications, a single instance of that application may be being used at the same time by many different users (concurrently).
- There is *one* primary thread of execution in your application, and *everything* runs on that thread. And by everything I mean the browser itself is competing with our running code. If your code is slow, the browser will become unresponsive. 
- There is not just one browser. Just because your app works on one browser, doesn't mean it will work on all of them. You need to do your best to test across as many browsers/devices as possible, but there will *always* be issues. The best way to prevent this is to a) know that browsers change and update every day sometimes. We can't control that. and b) so does Angular. They release *frequent* patches, updates, etc. and many of those contain fixes for problems found in newer browsers. Do everything you can to write, test, and structure your application so you can frequently update to new versions of Angular and your dependent libraries.

### The Running Application

There is not much built into the browser that we need to build applications. There is the Document Object Model (DOM) which is a JavaScript API browsers supply that let you use code to inspect the loaded web page, modify elements, add new ones and remove them. You do that with JavaScript, but that DOM isn't connected in any way to your JavaScript or the data you have in memory in JavaScript. So if in your JavaScript code you have a list of appointments, and you want them to show up on the page, you write code to use the DOM to add those elements. If you change any of those elements in your JavaScript, it does *not* update the DOM. The DOM has no reference to your JavaScript objects. You have to detect changes and update the DOM yourself. This "change detection" is a core feature of almost every frontend framework. It's horrible code to write and maintain, and it is *really* complex. This "change detection" is *not* a solved problem. We are still figuring it out. This is a challenge for us all because it looks like there are multiple ways to do things, but that's because when we make things better, we can't always get rid of the old way. In this training I will show you and use only the current "best guess" on how to keep the DOM in sync with our application state, and that is Signals. 

Our running application will use other browser APIs as well, either directly or indirectly. For example, the browser has a "history" API for managing the address bar. We *mostly* use an Angular abstraction over that called Routing, but it is very worthwhile to learn about this APIs, directly. Browsers have a few ways to make programmatic HTTP requests to other servers. In Angular we use an abstraction called the HttpClient primarily, but again, read about `fetch` and he associated APIs so you'll have a deeper understanding for when the abstractions Angular has for us aren't enough, get "leaky", or just plain break in your usage.

But the primary thing is the browser gives us a page for the user to see and interact with, and we define that through the DOM, or through HTML and CSS. A few low-level APIs, etc. 

And HTML is very low-level, if you think about it. It's not a way for us to express our model. It's Model (view of the world) is things like `h1, h2, h3, a, img, div, section, input, etc.`. Super generic. 

### Components

TLDR: Components are classes with a template that aggregate together related UI things. We "think" of Angular applications in terms of components. They are "isolated", with specific protocols for communicating with them. You can pass them data only from the component that "owns" (contains) them through declared `input`s, and they can call code on the component that contains them through declared `output`s. 

Any other communication through other parts of your application must be done using either services, or routing.

So the Angular team came up with a way to make the HTML "info set" less generic. You can group together a set of related HTML elements, their styles, and the code that works on that stuff together in an abstraction called a "Component". Components are, arguably, the *primary* abstraction in Angular because they represent units of related user interface, and Angular is about user interface. Without components, no UI, without UI, no Angular.

When Angular 2 was released, components had to be a part of something called a "Module" (more accurately, an `NgModule`). A module was a technical detail that proved to be wrong. It said that in an application, you might have a bunch of different things, and those different things should be grouped together in a meaningful way, etc. etc. I know I used to explain this like it made sense, but it never really did. Now components are free-agents. They don't have to be *owned* by a weird thing called a "Module", and they can stand on their own. These are the so-called `standalone` components perhaps you've heard of. 

> *Note*: These is zero benefit to using the `NgModule` abstraction in any new Angular development. It was a bad idea. It is still supported for backward compatibility, but who knows for how long? Do not write new Angular code using these abstraction, and do what you can to move existing applications away from it, is my advice. If you think there is a good reason and want to talk about it, I'm happy to.

Components are a *great* abstraction, but they can be a bit "heavy". Sometimes you will identify related types of behavior across elements or even components that aren't easy to fit into a "parent-child" isolated box like a component. 

### Directives

Angular has an abstraction called a `directive` that allows you to encapsulate common behavior across elements or components by "opting in". You opt in by adding an attribute to your element or component with the selector of the defined directive. 

For example, you might have something like this snippet of a template:

```HTML
<h1>Welcome to Zombo.Com!</h1>
<app-welcome-message />
<h2>The only limit is your imagination!</h2>
<footer>
<p>Copyright 2024.</p>
</footer>
```

And you want do something like, for some of these things, I want them to sparkle when you move your mouse over them, and play an "AWOOGA" sound on their speakers, and keep a list in memory of all the things they hovered over, because if they do it again, we want to play a duck sound effect instead. (do not take this as practical advice for application design.)

You could define an *Attribute Directive* that would allow you to annotate the elements where you want that behavior, and then your markup might look like this (assuming the directive's selector is called `appAnnoy`)


```HTML
<h1 appAnnoy>Welcome to Zombo.Com!</h1>
<app-welcome-message appAnnoy />
<h2>The only limit is your imagination!</h2>
<footer>
<p appAnnoy>Copyright 2024.</p>
</footer>
```

Directives are for adding "cross cutting concerns" to your templates.

Directives can be powerful, and can be made further specific by allowing arguments, etc. We will explore this in class.

There are also *Structural Directives*, which are related, but can actually create new content to the elements they are applied to. We will briefly explore these in class as well.

### Services

Services don't do UI. They support UI. A service is an instance of an object that we define that can be shared with components, other services, etc. 

And by saying "object" here I'm being super specific - an object is something that has "state" and "behavior". In other words, it is a thing that encapsulates some data, and gives you methods to interact with that data. If your service has no state, it doesn't *need* to be implemented as an Angular service.

But services are *super* important in Angular because of that state thing. And this is *the thing* that a lot of great, experienced developers screw up, especially if they have a lot of experience building stateless web applications. And that is "State" in your angular application.

It's so important, it's all in another document [here](./state).

A couple of important notes about services in general though.

- Instances of services can't be created (by us), they have to be `provided` by the framework.
  - This means you never use the `new` keyword on a service.
- Services *generally* are "Singletons", which just means for each service, there will be exactly one instance of that in memory of your application at any time. 
- Services, like the rest of your application, are ephemeral. They go away when the browser tab is closed or navigated away from.

## Routing

Again, another topic that needs it's own section (see [Routing](,/routing)), but at the conceptual level, routing is the ability to have different *modes* your application can be in. The name "Single Page Application" has caused some confusion about this. You do not, nor should you, define an entire application where everything is on the same screen all the time (unless that is what you decide is right). With Angular we embrace what the user already knows about working in a web browser, so these "modes" our application can be in must always be reflected in the address displayed in the address bar of the browser. Things like the back button and forward button in a browser have to keep working (that was HELL for years in these types of applications). Furthermore, because the URL in the browser reflects the state of the application, you have to write your application in such a way that a user can "jump" from one mode to another using the address any time they want without breaking your application. 

Routes have a lot of affordances for us as developers to express our application, like nested routes, sibling routes, resolvers, guards, etc. and we will explore many of these in class.

Routing in Angular also allows us to make technical choices about deferring the loading of a component until that route is visited. We'll talk about that, too.

One of our "rules" of building applications that run in a web browser is we can't arbitrarily replace the expected experience of web browsers. Routing and URLs are a big part of that. Another, related example, is that in a web browser the way you change the "mode" is you click on a link, right? We know this. That means any affordance you create in angular that is going to change the "mode" has to be a hyperlink. Except hyperlinks tell the browser to "forget this page, go get this other one", and we don't want that in Angular, because we'd lose the entire state of the application, have to start up again, all that. So we have Angular *intercept* hyperlinks and switch us to that "mode", *just like it would on a normal web page*. 

> I don't blame you if you are asking "why" here. Good for you. Lots of reasons, like indexing by web crawlers, etc. but a major reason is *accessibility*. If an assistive device like a screen reader encounters a hyperlink on a page, it can tell the sight-impaired user that "Hey this is a link that will take you to this page (mode)". If we make navigation happen through some other means, there is no way for assistive devices to know how to interpret that (without us giving it lots of hints, and even that is suspect in it's support).

## Displaying Content in Components

Angular applications are written using two programming languages. One is TypeScript, and the other is Angular Templates. The programming language for Angular templates is a superset of HTML, like TypeScript is a superset of JavaScript.

In other words, our templates *look like* HTML, we can use HTML in them and it "understands" that, but it has some things that HTML doesn't have.

One thing is it is *stricter* than HTML. HTML, out of necessity, is a loosey-goosey, free-love programming language. It has some rules, but if you don't follow them, the browser will just do it's best to figure out what you *meant*. For example, ever HTML element has to be defined and understood, you can't make them up (at least easily, see "Web Components"). Elements can have attributes, but they also have to be defined, their values, if any, have to be quoted, and they can only appear once per element. Most elements can contain other elements, but not all elements can be nested in all other elements. All that jazz. 

The problem is that if you do that, there is absolutely *no* guarantee that the browser rendering that will do it the same way as the next browser. So Angular's template compiler (Ivy) is strict about that stuff. It will tell you if you messed up. We *like* that as developers. Build errors means we can't put bad code into production. 

It also adds some things to HTML that HTML just doesn't have. Like variables, binding expressions, and even basic flow control like `if, else, switch`, and the ability to do loops `for` - you know, the basic building blocks of programming. HTML doesn't have that. Angular templates do.

> Note: Many of those things, like `for, else, swith, for` used to be provided in Angular through structural directives the Angular team provided. So you'd see things like `<h1 *ngIf="itIsMorning()">Good Morning</h1>`. Recent released have matured to the point where those common things are just part of the template language now. We will emphasize the new stuff here because it fixes a *lot* of problems with the old approach.

A contemplation to revisit often as an Angular programmer, because it is easy to lose sight of this:

Even if you *think* you are writing HTML, you aren't. You are writing in a weird programming language that *looks* like HTML, but no HTML is sent to the browser when they run the application. When you compile you Angular application, it does things converts (sometimes called *transpiles*) your TypeScript into JavaScript, and it converts your templates into JavaScript as well. That JavaScript uses Angular's rendering code to build the DOM according to the structure of your templates. It *has* to do this, because without it, it couldn't do the *other* things we need it to do, like inject the code that makes sure what the user is seeing in the browser is an accurate representation of the application state. If some of your data in your application changes, Angular will update the DOM for you. It's weird, a lot of abstraction, but it is *so* worth it.

### Pipes

A lot of the time what we are showing to the user is a combination of the "hard coded" stuff in our templates, intermingled in with *state*. Some data from an API, or something like that. And we often have to "massage" that data in some way to make it presentable to a user. For example, your API might return a number like `1023.23`, but you want to display it to the user in a friendly format that includes their currency symbol, all that. You can "push" those values through a function that takes the value, and returns it formatted in a way you like. Those are "pipes". We will explore some of the provided pipes in Angular, as well as create our own custom pipes in this course.

### Forms

This is a deceptively tricky topic because you *already know* what a "Form" is. And you are right. It's a thing you fill out (here, on a web page or whatever) with some data. 

But there is a thing about the web, which, even though we are building an "app" that *just happens to be in a web browser* we still have to honor about how users interact with our application.

The web (and specifically, the HTTP Protocol that browser and HTML grew up around) makes a distinction between just two kinds of interactions the user can do. Remember, in just plain HTML, there are only two *affordances* we have to get the user's input or data about *anything*. And those are links (hyperlinks), and forms.

We use Hyperlinks to say "this thing the user just did? This is a 'safe' operation.". What *safe* means here is that there will be nothing important changed because of this. Nothing the "business" cares about. There are no "side effects". 

In other words, if I'm browsing Amazon.Com and clicking links, nothing is getting added to my shopping cart, my credit card isn't getting charged for anything, etc. That's what is meant by "safe". (I know, a weird word for it.)

But for *anything* that is meaty, that is "real", we call that "unsafe", and that *must* be a form. Now, to make it worse, forms can also do unsafe operations. For example, there is this website called "google.com". I hear it is sort of like "Bing". But if you go there, there is a form HTML element, and inside that is an input element where you type what your search is. Because you they want to `GET` you your search results, which is a "safe" operation, but they need some input for you. They just can't show a page with a bazillion hyperlinks with all the things you can search for already in them. So, when you submit that form (by clicking search, or hitting enter), it makes a custom GET request with your search terms in the URL.

So, if you do a search in Google, you might see something like this (I removed some tracking crap they put in there):

`https://www.google.com/search?q=What+does+safe+and+unsafe+mean+in+http`

The stuff I search for is `urlEncoded` and added to the address. Here, try it: [Google: search](https://www.google.com/search?q=What+does+safe+and+unsafe+mean+in+http)
Now if the form I was filling out was doing things like collecting my credit card number, or other personal information, I certainly wouldn't want that displayed in the address bar. If the form I was filling out was me confirming I wanted to cancel my insurance policy, again, I wouldn't want any of that in the address bar, and those kind of things are what we mean by "unsafe". 

What this means is that do your best to follow the following "rules":

- Safe operations, like the user saying they want to load some data, or switch modes usually can and should be just hyperlinks in your application.
- Some safe operations might require input from the user (like the search example), and those should use a form.
- Unsafe operations, like whenever we are going to do something like "cancel this", or "add this"; whenever that affordance means the state of your application is going to change in some meaningful way, should ideally be implemented as forms. Even if the form is just displaying a button that says "Are you Sure?".

Again, we will explore this in class.

So, when HTML was created, there was only one affordance available. Hyperlinks. It never would have worked if I couldn't click something to see the next funny cat pic. But there is no way to collect user data (called "making a custom request") using a Hyperlink. Nobody can collect credit card numbers, this web thing is going *nowhere*. 

So they added some rudimentary form stuff. But there was no way to mark something as required, no way to validate what they entered, etc. before sending it the server. 

So the folks at Netscape said "Let's add a tiny bit of a programming language to the browser *just* so we can validate forms", and that is how JavaScript was born.

And forms *still* suck. They are *hard* to get right, and they are hard to generalize. This is a "hot point" where the "general purpose world of the web and html and JavaScript" most closely bump up against your unique snowflake of an application. With forms you are *always* collecting data specific to your application.

All JavaScript form libraries suck, but Angular's is about as good as any of the best. 

We will create and use forms in class a bunch, but nowhere near an amount that represents how much of your *actual* development work will be spent working with forms. 

A couple key pieces of advice, though:

1. Do everything you can to avoid forms. And you can't avoid forms.
  - For example, don't make users enter information that is hard to validate if you can help it. Don't make them type a date, use a component that allows them to choose a date. 
  - Don't collect data on a form you already have. 
  - Rely on browser's attributes and affordances to allow the browser to autocomplete forms from data it owns. [See Autocomplete at MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
2. Forms don't have to *look like* a form. Unless that is the best way you can do it.

The reason I make such a big deal about this is because Angular makes it too easy to screw this stuff up, and it can cause all sorts of problems, for example with accessibility. 
