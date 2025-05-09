# Facilitating Frequent Artifact Download

**TLDR:** In the following video, I take nearly an hour showing you how to implement the practices discussed in this TDR. The discussion following the video is some justification and details.

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1081962954?h=b0f9ff5e22&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="AngularChunking"></iframe></div>


The apps we build in tools like Angular have a somewhat unique mechanism for installing the software on the users machine as compared to other software delivery mechanisms. Users don't go to some sort of "app store" and download and install our application before using it, they simply are given a URL. 

We assume they have an internet connection, and a fairly recent browser. For most situations, this isn't too big of an ask. Most folks do. 

Even if users have different browsers, or different versions of browsers, we can *largely* reap the benefits of the *Browser Wars* having ended and being won by the proponents of a *standards-based* web platform. The way differing browsers support CSS, JavaScript, and HTML and the DOM are more closely aligned than ever. 

However even *slight* differences between browsers or versions of browsers might cause trouble for our applications. Frameworks and libraries like Angular try to mitigate these differences as much as possible, *nearly* abstracting these details away from us as developers. 

It helps to reflect on the fact that Angular applications a compiled into static assets at the time of compilation. The code that is generated, which is our application, could be different if you run `ng build` one day, and again the next day, *even if you didn't change your source code*. Why is this?

When we run `ng build` we are telling the compiler (TypeScript, the Angular Compiler, our CSS compiler, etc.) to generate some code that will run on a set of browsers that exist at the time of the compilation. 

This list of browsers is time *relative*. 

At the time of this writing (and it has been this for a while), that list is:

```
last 2 Chrome versions
last 1 Firefox version
last 2 Edge major versions
last 2 Safari major versions
last 2 iOS major versions
last 2 Android major versions
Firefox ESR
```

You can see this list yourself (and even edit it to include earlier versions you may need to support, or even other browsers) by running the following command in an Angular project:

```sh 
npm run ng generate config browserslist
```

A file called `.browserslistrc` will be created in your project directory. 

The file includes links as comments to help you understand it.

When you build your Angular application, it looks at that file (or the internal version if you have not generated it) and checks an API to see, for example "what are the last two versions of Chrome *right now*". The builder uses this information to *decide* the best way to represent your Angular application in JavaScript that will work and perform best across the selected set of browsers.

You can see the list of browsers that would match this default set *right now* by running, in your Angular project, the command:

```sh 
npx browserslist
```

On my machine, on Friday, May 9, 2025, at 11:37 ET, the set of browsers that matched the criteria is:

```
android 135
chrome 136
chrome 135
edge 135
edge 134
firefox 138
firefox 128
ios_saf 18.4
ios_saf 18.3
ios_saf 18.2
ios_saf 18.1
ios_saf 18.0
ios_saf 17.6-17.7
ios_saf 17.5
ios_saf 17.4
ios_saf 17.3
ios_saf 17.2
ios_saf 17.1
ios_saf 17.0
safari 18.4
safari 18.3
safari 18.2
safari 18.1
safari 18.0
safari 17.6
safari 17.5
safari 17.4
safari 17.3
safari 17.2
safari 17.1
safari 17.0
```


That means, for example, if later today Chrome 137 was released and I ran the command again, the list would be adjusted accordingly (only chrome 137 and 136 would be listed).

What does this mean? Who knows? Maybe nothing. Maybe something huge. Make sure you have tests.

## What's the Point?

In most cases, lately, you don't need to think about this much. Browsers are much more compatible than they used to be. But **recompile and redeploy your applications often**.

Keep your version of Angular up to date, along with all the dependencies. It is *possible* that a compiled Angular application that has worked for months and months might experience problems because of the introduction of new browsers or new versions of browsers. 

Unless you can force *all of your users* to use a specific set of browsers and versions that match the browsers and versions you compiled and tested against, you can have weird things happen. And you **can't** and **shouldn't** try to do that - force everyone to use "legacy" browsers. Trust me, we've been there, tried that, and it doesn't work. 

## Chunking 

Imagine if every time you wanted to use a particular application, you had to download it *again*. For example, you want to write some code, so you download Visual Studio Code, install it, run it, write some code, and then when you close it, it's essentially removed from your machine.

That is an extreme example of what we want to avoid with our Angular applications.

If you take a new Angular application you've created, and run `ng build`, in the `dist/browser` directory, you'll see some files created. For example: (Yours won't match mine, exactly).

```
-rw-r--r--@ 1 jeffrygonzalez  staff   15086 May  9 12:00 favicon.ico
-rw-r--r--@ 1 jeffrygonzalez  staff    3377 May  9 12:00 index.html
-rw-r--r--@ 1 jeffrygonzalez  staff  197650 May  9 12:00 main-AUZSW4ZH.js
-rw-r--r--@ 1 jeffrygonzalez  staff   34519 May  9 12:00 polyfills-FFHMD2TL.js
-rw-r--r--@ 1 jeffrygonzalez  staff   20404 May  9 12:00 styles-GDCKDR44.css
```

All of my Angular application, and the supporting stuff it needs, is compiled into the file `main-AUZSW4ZH.js`. There are also files for polyfills (`polyfills-FFHMD2TL.js`), and the CSS styles from my project (`styles-GDCKDR44.css`).

In *modern* Angular, the polyfills file contains just `zone.js`, which is included because it is in the `angular.json` file. I discuss Zone.JS and it's lack of a future elsewhere. 

> Note: I'll come back to `favicon.ico` and `index.html` soon.

Let's just focus on the `main-AUZSW4ZH.js` file for now. What does it contain? If you open it up in an editor, you'll see a wall of what looks like (and is) JavaScript code. Mine has only seven lines of code, though one line is 89,390 characters wide! 

This is the *very least* the Angular builder (esbuild, etc.) decided you needed to send to a browser to run your application. Like every comment and piece of white space is stripped out, even our type and variable names are "minified" to make them as small as possible. In my example, only a *very tiny bit* of that code is code I actually wrote (my application just had one component!). The rest of that is what Angular needs to successfully *bootstrap* your application.

The compiler, when we run `ng build`, starts at the `/src/main.ts` file compiles the code from TypeScript to JavaScript, and follows the `import {...} from '...';` statements, importing the code we are depending on. It builds up a sort of tree-like structure in memory, and as it progresses through our labyrinthian code it uses that tree graph to decide if more code needs to be imported, or if the code it needs is already present. For example, if you have five components that use the `JsonPipe`  from Angular, it doesn't include five copies of this in the compiled code. It can reuse what it already has. 

> Note: At some point the compiler got smart enough to not import code that isn't actually used. You should still remove those unused imports, but it's more of a party foul than a real issue these days.

After the compiler has done effectively the first pass of your application, it uses a process called, poetically enough, *tree shaking*, to find any code it has imported into it's tree (graph) that isn't really being used and throws it away. It then produces the `main.js` file, which is all of, and hopefully only the code that is really needed to start the application in a web browser.

**Every Time** you recompile your application there is a *chance* you may get a different `main.js`, even if you didn't change your code at all.

- It could be because of the `browserslist` stuff mentioned above.
- It could be because you updated a node package that has code that ends up in your compiled application.

The compiler uses a slightly weird way of indicating a file has changed. When it is done compiling the code, the final output is run through an MD5 hash algorithm. The returned output from the hash function is a string that is included in the file name. So, one one compile you might get a file called `main-AUZSW4ZH.js`, and the next compile you could get `main-SJ5LRRZ6.js`. If even one character in the file changes, you will get a different file name, therefore a different "version" of the compiled code. 

How does the browser know what *version* to download? Well, it doesn't, really. Angular links to the *current* version, right before the end of the `<body>` element, in the `index.html` file.

```html 
<script src="main-SJ5LRRZ6.js" type="module"></script>
```

So, the user requests `index.html` on some web server where you've placed your compiled code. Let's say the server is something like `https://www.super-duper-angular-app.com/`. (`index.html` is the *default* on most web servers, which means if the user doesn't *explicitly* ask for it, just send that.)

The browser downloads that file, then follows the links. So our `<script>` element tells the browser it should download the `src` file and execute it. 

The browser, though, first checks to see if it already has a file laying around it can use instead of downloading that file.

It basically says "Do I have a copy of `https://super-duper-angular-app/main-SJ5LRRZ6.js` in my cache that isn't too old for me to use? If it doesn't, it downloads it. If it does, it just uses the copy it has handy.

In order for the browser (or intermediary servers, but we won't go there for this conversation) to know if it should store it in the cache after it downloads it, the HTTP response message *must* have a `Cache-Control` header. If the response does not have that, it shouldn't be stored in the cache. Without going into the cache control stuff too much, it can say things like "no, you can't cache this", or "yeah, this is good for a week from when you downloaded it", or "it expires on July 13, 2026". Browsers can even be told to check to see if the version they have is still considered the latest version. (That is "revalidate"). 

None of this makes any difference to us in this context, though, because the user of our application is *always* going to request the `index.html`, (which, by the way, should have a `no-cache` cache control header), and then is simply going to download whatever links (stylesheets, scripts, etc.) that are found in that file. If one day the `main-AUZSW4ZH.js` is the link, and the next it is `main-SJ5LRRZ6.js`, it will just download the new one.  

But if it is the same between requests, there is *no reason for the browser to download it again*. It is, by virtue of it's name, the same file. If *anything* in that file changed, it wouldn't have the same name, the `index.html` would have an updated link, and all that jazz. 

Therefore resources like JavaScript files and CSS files that have an MD5 hash in their name should contain a `Cache-Control` header in the response that says "this is immutable. It never changes. If you ever need this in the future, whatever you have is fine to use." Except there is no way to say "keep this forever" in web caching, so we typically say it is good for a "year". 

You program your web server to say something like this in the response for the GET request for the script:

```http 
200 OK 
Content-Type: text/javascript 
Cache-Control: max-age=31536000

allyourjavascriptcodehere
```

That 3153600 is roughly the number of seconds in a year.

So, anyone using your application for the first time will "pay the tax" of downloading the JavaScript file, but will probably have it in their browser cache on subsequent visits. Unless the file has changed.

And as I've tried to painfully make obvious up to now, it can change all the time. It might be because you actually fixed a bug or added a feature, and you'd want that to be downloaded. No problem. It could be because the code that is embedded in there from the Angular team or one of your dependencies changed, whatever. You want them using the *latest* version.

### The Problem 

Without having a plan that `main.js` file can get *big* over time. You add lots of features and stuff to your application, rolling them out over time, fixing bugs, tweaking things, you know, "being responsive to the business", but every time you do the users of your application have to download the whole thing again. 

And the bigger the file gets, the longer the user will have to wait not only for the download, but also for the code that is downloaded to be verified and executed. The users see a blank page (or a cute little animated "loading" GIF or whatever), and it sort of stinks for them.

And if you are working on an application as a team of developers, this can really spiral out of control. Maybe one developer fixes one little typo in one component in your application, something that doesn't have anything to do with your code at all, but now the user has to download the whole thing again anyhow.

## The Guidance 

Here's our best thinking on this right now. It may change in the future, and things like Server-Side Rendering may change this, but:

### The `main.js` 

This file is pretty much beyond our control. It will change sometimes even when we haven't made any change to our application code. We want to keep it as small as possible, and it is best if it contains *none* of our application code, or as little as possible.

It *must* have a `Cache-Control: max-age=31536000` header on the response.

The code that creates the `main.js` file is in the `src/app` directory in your source code. We know *at least* any changes to the code in this directory will produce a new `main.js` file. Be skeptical of adding new code to this directory - it will bloat the `main.js` file.

The `main.js` should be responsible for "bootstrapping" your application once it is loaded into the browser, and that is it. Again, if you look at your `main-HASH.js` file, there is a *ton* of code in there that isn't *our code*. It isn't code we've written, we don't control it. Try to keep *your code* that you do control out of that as much as possible. It's got a big job, and we want/need that to be updated frequently without requiring our users to download and parse a huge file each time.

One thing to keep in mind is that, looking ahead here, if you implement chunking of your application, each change in any chunk will create a new version of this `main.js` file. For this reason, I don't have a problem putting in some *specific* code within the `src/app` folder, for things like a layout, basic navigation, etc. This includes the `app.routes.ts` and `app.config.ts`. 

### The "Features" of your Application 

Explicitly structure your application source code in terms of user-facing features. 
For example, most *newbie* Angular application developers put their application code in `src/app`. They add components, directives, services, and just keep throwing more stuff in there. 


#### Defining Features 

Here I primarily mean pieces of Angular code that are grouped together based on their likelihood of changing together ("temporal coupling"). For example if a change in a component or a service is because some other *specific* code requires that change, that is a "feature". 

##### Routed Features 

Often features in your application surface to the user through a link they click. We use Angular routing to put our application in the "mode" of showing that feature through routing. The displayed URI in the browser changes. All that stuff. 

This routed feature could be just a component, a component that aggregates other components (that it "owns", so also in that feature's folder), or components (or services) that are *shared* across many features. (we'll discuss this below). Routed features can also have *child routes* of their own, either now, or in the future as the feature grows. 

Routed features map really well to using practices like "feature flags and feature toggles".

**Consider**:

When you identify a new *routed feature* for your application create a new directory *just* for the code for that feature. (e.g. `/src/features/comparison-shopping/`).

This should be it's own "self contained" world and should not import or use any code defined in any other feature in your application, other than code in the `node_modules` folder. The exception to this will be using code from a `shared` feature, which we will discuss below.

This feature will be turned into a chunk by exposing a set of routes and having the `app.routes.ts` use `loadChildren` to provide them. 

> Note: `loadChildren` and `loadComponent` inform the build process to put all the code in a separate JavaScript chunk when building the file. I don't often use `loadComponent` for routed features because it will require changes if and when that feature adds it's own routes, but you certainly *could*. 

New features in an application tend to get a high rate of *churn*. Or at least they *should* if you are practicing continuous integration. Developers and other testers will find a fix bugs. Stakeholders will make suggestion, corrections, and ideas. You will, as a developer on the feature, "figure out" the optimal code to implement that feature based on the actual use of the code (I try not to use the word "refactoring" too lightly these days, but that's basically what I mean here.). Setting up your feature this way will give you the freedom to *iterate* on the code and only require the users of your application to download those changes, not *everything* each time you release a new version.

                                                                                                     o
##### Non-Routed Features (Components)

Sometimes you have a non-routed feature in your application that has a lot of "churn". It's implementation changes frequently, at least for a while, but don't naturally fall into a "routed" situation.

If this is something that is part of another feature, consider just leaving it in that features `components` directory. 

These kinds of features exist as part of another feature, but they have a different rate of change than the rest of the feature.

An example from my own work was a sort of "onboarding component". We had a component that was responsible for allowing visitors to sign up for our service. It changed *all the time*, because without it, nobody would use our service, and nobody would pay us. We did a lot of design, a lot of "a/b" testing, and tweaked it constantly - changing the user experience, changing the language we used, all that stuff. 

Angular's `@defer` template directive can be great for these kinds of things. A deferred component will produce a new bundle containing only the code for that component. But it will only do this if that component is not used *anywhere else* in a non-deferred way. This is a good approach if the component that represents this "sub feature" is a one-off thing. Like onboarding, or perhaps a intensive visualization of something specific. It is not useful as a "shared" anything. 

For this reason, making an explicit place in your source code within your feature for these. (e.g. `/src/fetures/users/deferred-components/onboarding.ts`)

I cannot think of a time where a deferred component would be placed in a "shared" location, but your mileage may vary. 

##### Shared Stuff 

You will no doubt have things you want to share across two or more features of your application. These could be services, directives, components, pipes, utilities, whatever. 

> The first rule of sharing stuff is do not share stuff. Or at least be super hesitant to. Owning a "shared" or "utils" folder is a great responsibility. The idea is to create a sort of "junk drawer" for your application. Just know that *any* change in a shared thing will trigger a new bundle/chunk for any feature that is using thing. 

The *right way* to share things across features is to have the shared stuff in it's own separate project and node package that can be `npm installed` into the project itself. When you `npm install` you are "pinning" a certain version of that shared thing to your application. 

This way, if that shared package has an update, there is no way it is going to negatively (or, positively) impact your application until you deliberately update your dependency. 

This is a *big ask* within an application, though. It is well suited for sharing common things across multiple Angular applications within your company, but not within a project.

Consider:

Making a "rule" that no feature can `import` any code from any other feature within your application. (other than `node_modules`). The `counter` feature cannot import anything from the `app` folder, or any other feature, for example. 

For the *few* things that are deemed both *stable* and *important* enough to be shared across various features in your application, create a specific directory for these things (e.g. `/src/shared`). 

Pull requests that impact this folder should not involve any other code within the application. 

These typically need a higher standard of testing, including things like "unit" tests for your components, etc. You want to make sure, as much as possible, changes in things within shared won't create a cascade of issues for every feature that is using something from shared. Know, though, changes *will* create new JavaScript chunks for any feature that is using them. 

A common example of a shared thing would be a service that provides cross-cutting functionality for some or all of the features in your application. Maybe it is a wrapper around some observability library, or security related HTTP interceptors, etc. 

> Note, in the case of services, these are often provided by the `app` feature, either in the `app.component.ts`, the `app.routes.ts`, or the `app.config.ts`. If other features in your application are going to `inject` these services, put them in a `shared` directory, not the `app` directory. Remember the `app` feature produces `main.js`, and it will change all the time. Things imported into features from `app` will often trigger new chunk/bundles even if the code has not changed.

## What About "Progressive Web Apps"?

The browser's cache does not work *at all* if the user does not have a network connection. Even if resources are found in the cache, they won't be used if there is no network connection.

### A Few Examples of How Folks Update Applications

#### 1) They Don't. 

Some applications, once they are installed, never update unless you (as the user) explicitly update them. I think the Git source code control tool is a good example of this. You install a version, you are using that version of Git until you explicitly install a new version. 

#### 2) Blocking Updates 

Some applications, I notice, when I open them, will immediately tell me "hey, hold one, there are updates, let me download them first". Discord, I'm looking at you. I cannot decide if I want to update or not, as I can't run the application until the updates are applied. 

This is basically how Angular works, as we've discussed here. I "open" the app by asking for `index.html`. The links are followed. If there are no updates since I've used it last, I run the cached version of those files. If there *are* updates, the startup time of my session with that app might be delayed as it downloads the new assets. Edge

The only problem with this model, especially after you've applied the guidance here (and the in the video) is that if you don't have a network connection, you get *nothing*. Doesn't matter if everything is in the cache or not, the application won't start. 

But what if it did, somehow (keep reading)? Your application starts, but then, in my experience, most Angular applications are *pretty useless* without a network connection. Our code is going to run, and then more often than not make API requests to load late-bound state for the user. It would be like going to your favorite online shopping site, and it shows you the "shell" of the application, but cannot show you any products because it gets those from a separate network call.

Of course, the response from those network calls could be cached somehow, but they can't. Or maybe shouldn't be. 

#### 3) Silent, Optional* Updates (Progressive Web Apps)

Many (non-Angular) applications have a way of silently updating themselves in the background, and then *notifying* the user of an update. For example, in Visual Studio Code, you might have a notification on the gear icon in the bottom left that a new version is available. You, as a user of VS Code, can *choose* to install this update. 

Progressive Web Apps are a browser standard to have this sort of functionality in your browser-based application. Progressive web applications let you *start* your application without making any requests across the network *at all*. For example, if I installed Visual Studio Code three years ago, and never updated it, it can still (I think?) "start". 

For a while folks experimented with leveraging this PWA model to just get faster startup times for their Angular applications. So the Angular app will "start" *always* from the last "version" the user has downloaded (no matter, really, how long ago that is). If they have no network connection, they can continue to "use" the application (but again, consider how useful your Angular application could be if you had no network connection). If you *do* have a network connection, it doesn't matter. You still run the old version, but then, in the background, it checks to see if there is a new version available. You could either prompt the user to (optionally) download and run the new version. So it gets downloaded in the background, the idea being that the user can continue using the "old" version until it is downloaded, and then they could be prompted to "restart" to begin using the new version. (which would be a browser refresh). 

As you can imagine, this can become a bit of a nightmare for maintenance. 

There *are* great uses for this kind of thing, but I really encourage you to exhaust all of the techniques I've shown here before even *considering* using a PWA for this "off brand" usage scenario.

The *on-brand* scenario is to create Apps from web pages that:

- Can be "installed" on the device the user is using and start instantly. 
  - May browsers will give you an indication on the address bar that the page you are viewing is available as a PWA. For example, if you go to https://youtube.com, you may notice a boxy icon in your address bar that if you hover over it, will allow you to "install" the app. If you do that, depending on your operating system, you will get a new window with the "app" that is still a web browser, but doesn't look like one. No bookmarks, forward and back button, or even an address bar. So you have to design your Angular application to live and be legible in that kind of environment (if you decide to use that feature).
- "Offline First" is a *thing*. Some applications built as PWAs embrace an ideology called "offline first". Which is just to say that they don't *expect* or *require* a network connection to work, and/or will continue to work with intermittent network connections. They usually use Service Workers to synch and cache data between periods of network connectivity. 
