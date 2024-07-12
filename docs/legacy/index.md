# Supplemental: Moving "Legacy" Angular Application Forward

## Modules

Angular *used* to have an abstraction called a "Module " (`ngModule`) and there was always, in ever Application, at least one of these things (usually called the `AppModule`). This was a weird sucker. It was almost always an empty class, with a decorator on it, the `@NgModule({...})` decorator, where that object it takes had properties where you had to list out all the "pieces" of your Angular application, and all the things those things would need. Your application, for example, couldn't have a component unless that component was also listed as part of the module. Any service you created was invisible to the running Angular application unless you told this module about it. 

There are reasons this was thought to be a good idea at the time, but they are boring. It wasn't, or at least isn't a good idea now.

It created hot spots of code changes, for one. Every developer on a team was *always* messing with this file, and it was a common spot for the dreaded merge-conflict hell.

And it was just sort of dumb. Just something we "had to do". You'd often get runtime errors because you'd create a component, and through dependency injection, ask for a service, but you forgot to list that service on your module. So you'd get an error on you component, but the error had nothing to do with your component, it was in your module. Frustrating. 

Also, it made it really hard to look at something like a component and be able to "grok" it. You could see in your template, maybe, you were using a component, but the source code told you nothing about what that component is or where it comes from. 

This also made us have to do these terrible things in our source code naming because no two components with the same name could be added to the same module. So if one developer created a component called the `ListComponent`, you'd have to have a meeting and fight it out if you wanted to have a component called `ListComponent`. It got so bad that a lot of developers started doing this thing we called the "SCAM" pattern. Should have known right there, just by the name. That stood for "Single Component Angular Module". So, for every component you created, you'd create a module that had *only* that component, but you could call your component whatever you wanted. If you wanted to use that component, though, you still had to import the module into your module.

Those days are over. Let them die. Use standalone components, services with providers, all that. If you grumble because you have to import *everything* in each component just know that this is *still* way better. 


## Change Detection

As mentioned elsewhere, web browsers aren't a good place to run applications with state. That isn't what they were created for. At some point JavaScript got added, and we had some state, but it was hard to work with. Most of the code your company was paying you to write was code to keep the DOM (the thing the user can see) in sync with the state in your JavaScript. And it was repetitive, easy to screw up, etc. 

They have never fixed this in the browser. And I'm not holding me breath that they will.

It's too big. It'd be like if one day we decided that your toaster should also butter your toast automatically, and somehow we had to simultaneously update *everyone's* toaster to this version (good luck!), *and* we had to make sure that all the bread sold, even the stuff on the shelves, could support this new "feature". Ain't happening.

In the early days, only the companies with the most to gain and vast resources were writing "real" applications that run in a web browser. It just wasn't worth it for most companies to attempt it. If you were Google, you could create something like GMail, or Google Calendar, but (let me check their valuation) yeah, they can afford that, and it benefits them. 

Most of us just stuck to either old-school HTML and HTTP Web Applications, with maybe a little bit of JavaScript thrown in for some "pizazz", or we used the Universal Alternative: Flash. Macromedia, then Adobe, had a product called "Flash" that was closed source, made for animations and stuff, but could be run in a web browser because at some point the World Wide Consortium thought it would be a good idea to allow web pages to download arbitrary code and execute it in your browser. Talk about viruses! 

Anyhow, that lasted for a while, made us some money when we needed something more than a web application, or having to write five different versions of the same JavaScript application that would run in all the weird browsers out there. And then Steve Jobs (RIP, pouring some apple juice on the ground) killed Flash. I'm no MBA, but Apple is what I'd call "a big company", and the iPhone and then the iPad were getting HUGE market share. And he said that they would never support flash. It was *painful*. Pulling a bandaid off of a wound that isn't healed yet painful. 

But this put the web on a better trajectory. The browsers *had* to get better. And they did. HTML 5 became a thing, finally, and it was focused on application development. JavaScript started to evolve into something more than a "toy" language. JavaScript performance was finally good enough for most cases (largely from Google with their V-8 JavaScript engine).

We were getting closer to a world where mere mortals could write applications that run in the web browser, but we needed some help. Especially with that sort of important "Keeping the DOM in Sync with the State in the Application" thing. I'm not kidding you, even something simple like a "To Do List" would take *tons* of code, and most of that code had nothing to do with your list, it would be keeping the DOM up to date (and your in memory list up to date ). 

There is a *mismatch* in browsers between what we see (the DOM), and the code and data that creates that DOM. It's a bad system. But it's all we have.

And as developers do, they try to fix it, to generalize it, to create some tools that hide that messiness as much as possible so we an focus on the hard business of To Do list management without getting lost on those weird details.

Lots of different frameworks and libraries appeared that tried to solve this in various ways. From lightweight little libraries like Backbone, to full "MVC" style frameworks like Ember. One of those was a project by a developer named Misko Hevery he called "AngularJS". It was cool. Not the only game in town, for sure, but it had some compelling things about it. It was pretty heavy and opinionated. It came out in 2010, and browsers were still pretty crappy then. There was no TypeScript or anything like that. This AngularJS thing did a bunch of stuff *besides* change detection that made it easier to get into app development in the browser, like having ways of doing declarative programming for data and composition, it also handled some things like concurrency and asynchronicity in the browser (weird stuff if you were new to this) with an abstraction called "promises". And it's change detection, called "data binding" was like *magic*. 

It seemed to hide all that complexity away so much you almost forgot about it. Until it broke. And then it was a bear to figure out what was going wrong. And it turns out, people started building BIG applications with this, and it just didn't scale well. Updates *might* happen on your display, but it will be a while, and in the meantime, your browser seems locked up.

Google got involved and sponsored it, and put some developer resourced into it, but at some point they needed a rewrite. A lot of the stuff old AngularJS provided was now built in to browsers. JavaScript was much better and more expressive now than it was when Misko created it. They could do better. So they created Angular. 

> Note: I wish they would have changed the name. That is *still* confusing as heck to a lot of people. They are barely related it was such a major rewrite.

Angular apps were much more *intense* than AngularJS apps. You needed a build process to convert your TypeScript into JavaScript, but it was hugely better in terms of performance for sure. They made a lot of both clever and obvious improvements on how change detection was handled and it got us by for a long time, while largely *appearing* to be pretty close to what we had before.

They pretty much "solved" (for the time) change detection from the point of the view of the user changing stuff in the DOM and that getting reflected in our state, and vice versa. Basically, when Angular compiles your templates, it injects in a bunch of code to watch that stuff and keep it all in sync for you.

But that is not the only thing that can change the state of your application. What if you write some code that says "every five minutes, change this state in this way". It's not something that is happening through the DOM, so how do we "detect" that? And what if the state changes based on an API call you just made? That doesn't happen in the DOM, it happens in the code, and... 

Well, they did something of a hack. Even then we knew it was sketchy, but it was so darned clever and it just worked we allowed it. 

They "Monkeypatched" a bunch of crucial browser APIs. 

### Zone.JS

Zone.JS is a library that Angular depend(s|ed) on that would silently replace a bunch of browser APIs with new code that would add change detection in. So in an Angular app, when you write some code like `window.setInterval(...)`, which is how you do something on a schedule, you aren't *actually* calling the browser's `setInterval` method, you are calling a Zone.JS function that is an imposter, and it sets up some change detection, stuff, *then* it calls the browser's *actual* `setInterval` method. Same thing with HTTP stuff. That makes it sound simpler than it is, because it also creates a thing called a "context" so that it can economically *target* changes without having to re-render the entire page, and all that stuff.

And it got us by for a while. All so we could ignore the elephant in the room - which is browsers don't work this way. But we wanted our simple "data binding" where we could say `<p>{{title}}</p>` in our templates and not have to *think* about all that stuff.

Zone.JS has a couple of problems. First it is a *bunch* of code and it gets involved all over the place and that slows our app down. Secondly, like so much good software, it was created at a particular point in history, but things have changed since then. One good example is JavaScript borrowed some syntax from C# called "async/await" as a way to handle asynchronous code while making it *look* synchronous. It's awesome. But Zone.JS can't handle that. It doesn't have access to our source code, just those browser APIs that our code uses. 

> Note: Despite what you've been told, you almost always *can* use `async/await` in Angular. What the Angular compiler does is rewrite any of our uses of that to something that *can* be handled by Zone.JS. (it rewrites them as async javascript generators, if you are curious).

Long story short, like so many things in software development, Zone.JS helped us to get us where we are, but it's outlived it's usefulness. It's now getting in the way of some of the things Angular needs to do to accommodate the kinds of applications many want to build with it. (example: Apps with server side rendering), and it is hurting performance as we write better applications. 

Angular now says in future releases (19+) Zone.JS will be "optional". Not to be the cynical old guy, but 98% of the time when a company says that, it means they are getting rid of it. They still have some work to do on their end, but they are almost there.

But that doesn't mean you'll simply be able to get rid of it in your applications. The biggest obstacle for most developers will be that components cannot modify state directly anymore unless you *manually* tell Angular to do change detection. But your other alternative is to use Signals, which do just that.  

Technically, your components have to conform to the `OnPush` change detection scheme. We'll talk about that in class.


