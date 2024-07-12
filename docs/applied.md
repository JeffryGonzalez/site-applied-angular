# Applied Angular

This course is for developers who have chosen Angular to create applications within their particular business domain.

Even if you were not the one that made the choose to use *Angular* for your application, it is important to see it as just one possible choice among many to do write an application of a certain *kind*. 

There are lots of kinds of applications developers build. All applications have some functionality they provide, and most importantly, they have *something* that "pokes" them, and makes them "do things". There is some kind of stimulus that our application responds to. Even an application that runs in the background, doesn't have any visible "user interface", and is just
a kind of "worker" has something that makes that work happen. It could be a time schedule - every hour it does this task - so the *driver* of that application is the clock. It could be watching a directory on the file system, and when a new file appears, or one is modified, it springs into action. Some are "services" that run somewhere on a machine, and other programs can interact with them in some way. For example, a "Web API" might be a program that listens for *HTTP Requests* of a certain kind, and knows what to do when that request comes in. 

So, we call that way of "driving" an application, of getting it to do something, it's "interface". It gets confusing because there is a related *thing* in many programming languages called an *interface*, but what we mean here is specifically the way - contract, protocol - under which the creator of that application says you need to do to accomplish the mission of this application."Drop a new file in this directory, and then this thing should happen", "Make an HTTP GET request to this resource, and you should get this back", etc. Those are examples of interfaces that are designed for other software to use.

Angular is for making "User Interfaces". Angular applications are driven primarily by a real human being. That is it's "sweet spot". In other words, you probably wouldn't choose Angular to make an API that doesn't provide a user interface. 

There are lots of ways to create user interface applications, and tools for doing that. Here are some examples:

- Command Line Interface (CLI): Requires users to issue commands, usually through arguments or "flags" to make the software do something. 
  - Git is a good example of this. Git is an application that you run by invoking it's name, and telling it what you want to do. Like `git init` initializes a new repository in the currently directory. `git log` shows you a history of the changes in your repository, etc.
  - CLIs are *good* user interface for users that do the same set of tasks repeatedly, and almost always those interactions can be bundled together in specific workflows by creating scripts that when executed use the general purpose CLI commands to do a specific thing. For example, if you create a lot of git repositories, and push them to GitHub, you could create a script of the commands you use to do this, and just run that instead.
- Terminal User Interface (TUI): A variation on the CLI, uses rudimentary features of a terminal to present a user interface that allows for less "modal" interactions. It may present a set of options to choose from, and display data to help you decide what actions to take. Examples might be something like Midnight Commander, which is a terminal based file manager, Vim which is a programmer's editor, of LazyGit, which is a tool for managing git repositories. These tools are more popular in the Linux world because often developers or administrators are interacting with Linux servers remotely.

Those kind of user interface applications are popular for *technical* users that need to accomplish complex things repeatedly and frequently. Most of the best ones are designed using something that has come to be known as the "Unix Philosophy", which is it is better to have a bunch of small, tightly focused, special purpose applications that can be combined together for specific uses than to have big *monolithic* applications that do just a specific thing. That is *power user* stuff, and we can't really expect the users of our applications, often, to work with our systems in that way.

*Graphical User Interfaces* (GUIs) have a more specific scope. They are used to do a specific thing. Like you might use a specific program to do word processing, play a game, or check your email. The goal of the creator of a graphical user interface is something along the lines of "We want to make it obvious to do the thing you came here to do. Any time you read the manual or ask for help is sort of a 'fail' on our part, so we will make it as simple and direct for our specific use case as possible, though you may have to dig a bit if there are some more advanced features you may need eventually".

They also, historically, have had a big limitation - it is hard to create a graphical user interface that isn't dependent on very specific functionality provided by the operating system. All I mean is it has been hard to create a GUI application that is *cross platform*. If you create a GUI application that runs on Windows, that application would not work on a Mac, for example. 

Another problem is *versioning*. With any kind of application a user installs on their machine, they are installing a version of that application at a specific point in time. It is largely up to them to decide when and if they update to a newer version. This can be a good experience for the user in some cases, but what if the application has a bug, or we have to *force* the user to update because some "business rules" the application relies on have changed?

This is really an issue when you are building *distributed applications* where a portion of the application runs on the user's machine, but it interacts with other shared software (APIs, databases, etc.) on the server. Trying to keep server changes and client changes in lock-step with each other is challenging when you might have a user that shuts down their machine during vacation and misses the automated update, and when they come back they are still using the old version of the applications "front end" that is incompatible with the "back end" services that it interacts with.

Then the WorldWideWeb (WWW) happened. As we know, the World Wide Web was created to share cute cat pictures, but it also had some things that made it start looking like a graphical user interface, especially when they added forms. You could do things like collect credit card numbers! It was rudimentary, especially in the beginning, because you couldn't even run any code in the browser (JavaScript hadn't been invented yet). But many companies made a decision. It was basically this:

- We can create kind of crappy, limited user interface by using the Web. We can fool people into thinking it is better by adding colors and graphics and stuff, but it's going to be awkward compared to a "real" application installed on their machine.
- In exchange, the versioning thing goes away. The only thing they have to have installed is a web browser. Every time they load our "app" they get the "latest version". Heck, if we roll out a bug fix, just tell them to refresh!

We created a bunch of tools to help developers program these "web applications", which were just programs that would run on a server and produce snapshots in the form of HTML of what the user should see now. Want to see your shopping cart? Go to `https://our-store.com/cart` and we will run some code that gets your cart from the database, and writes that into some HTML and sends it to you. Want to send us some feedback? Fill out this HTML form, send it to us, and we'll store it, and send you back an HTML page saying "Thanks".

Web Applications like this, written with tools like *CGI Scripts* with languages like *PERL*, or Microsoft's "Active Server Pages" (ASP), or "PHP", or "Rails" were all the rage. Most of the code was at the server. 

They rely on the HTTP protocol, which is the protocol of the WorldWideWeb, which is constrained in an important way. It is a *stateless* protocol, it doesn't maintain a connection with the client. Not all protocols are like that, but HTTP is. What that means is that when the server sends you a "snapshot" of the "state" of your shopping cart (we use the term "state" to mean something like "the data at a particular point in time", like "I want to see my bank balance as it is right now" or "I want to see my bank balance as it was last June 15 at noon". Same "thing" - the balance - different times), the snapshot of the state (called a "representation" in HTTP) is always stale. It isn't even "data", it's just text - in the form of HTML. So, if I ask for my balance from the bank, it reads it from the database, and sends me a "copy" of that data to my browser, I look at it, but if some other process changes that balance, I won't see that until I ask again "what is the state of my balance NOW". 

This kind of thing makes it really hard to build certain types of applications. We have to write a *bunch* of code to make sure we don't screw things up because of that. 

Also - it was pretty bad user interface. Really, your only tools for designing interface were rudimentary forms and hyperlinks. Everything had to be done at the server. Eventually we got some more programming tools - the Document Object Model (DOM), and JavaScript, but that just put us back to where we were with GUIs before - which is we couldn't control versioning. Some of your users might be using an older browser that didn't have these new features, and there were no real standards across browsers (we an blame Microsoft for this one), so the way you would do something in every browser would be different. 

Well, Apple had a solution to this. Write applications that are great user interface for users and add them to the our App Store! These won't be Web Applications, but full GUIs that run on our hardware. Obviously that is a problem, because you know how to do some web programming, now you have to learn the Apple stuff, and *it would only run on iPhones!*. The web development community went bonkers. And we pushed to fix it. Mostly. Long story, but now there is some consistency across web browsers, they are much more reliable and stable, JavaScript grew up quite a bit, and most people are running whatever the latest version of their browser of choice is, because they auto update ("ever green").

But it is really hard to write *stateful* applications, especially if you've only ever built things with the stateless model of HTTP. And as good as browsers have gotten, there is a lot of residual weirdness. We basically created this Frankenstein's monster that was born to just show funny cat pictures and stuff and have turned it into an environment for running real applications, but it still hast o be able to show funny cat pics (and everything else good on the web already).

The browser is *not* a good place to run or write software. It's got a lot of *baggage*. 

As a matter of fact, I'm a firm believer that you shouldn't write applications that run in a web browser *unless you have a dang good reason to*. It's just *hard*. Hard to make secure, hard to make even work correctly, all that stuff.

> If what you are trying to do is build an application that *can* be stateless - e.g., it uses forms, links, etc. then don't write an application that runs in the browser. That way lies madness. I've seen *scores* of flaky, expensive React, Angular, Vue applications that I could have written the *exact* same thing in using web application technology, and maybe a dabbling of JavaScript for *much* cheaper, faster, and more reliably. If you are going to build an application that is delivered in a web browser, create a prototype in something like ASP.NET MVC and see if that is good enough, first. You'll be happier.

I only say this because *somehow* it's almost like folks think the only way to create applications that are delivered to a web browser is using some big heavy framework, like Angular, even if they don't need that.

## When Do You Need It Then?

There were a few reasons for the rush to the so-called "Single Page Application" (SPA) model. That is the name we have given to this style of application, which is actually just  Stateful JavaScript application running in a web browser. There are some good reasons, there are some reasons we *thought* were good when we started, but turned out to not be so good, and there are some *bad* reason that have always been bad.

### Bad Reasons

Really, for me, this boils down to some version of "It's what all the cool kids are doing". That with the advent of frameworks like AngularJS, React, Vue, etc. it become considerably *easier* to do some common things in the browser. It is just human nature that when a new thing comes out, it *must* mean this is the replacement for the old thing. 

### Good Reasons that Turned Out To Be Bad Reasons

A couple of things here, but I think we thought we would make user interface better just by having new tools in our tool box, but we didn't spend enough time learning how to actually do that stuff. A generation of developers that created crappy user interface because *that's all they could do* with old school HTML and web servers didn't step up their game enough. And I'm making efforts, but I am part of that world, too. We still see the user interface world through the lens of hyperlinks, forms, and sending data back and forth to the server. So our Angular applications look almost exactly like our applications have always looked, but just at twice the price and ten times the frustration.

This next one is a little more controversial, but it has to do with us, as an industry, being sold on an ideology that just hasn't worked out. Its something like "If you have a big company, have teams create general-purpose *services* for every important aspect of your organization, and then you can create new exciting user interfaces by just calling those services, like putting together Lego bricks". 

We tried. It failed. This is an interpretation of a architectural style called "Service Oriented Architecture", and *man* did it look good on paper. But - in retrospect, we should have seen this coming as developers - creating "shared" abstractions is *hard*. I mean, I remember the big marketing pitch behind Object Oriented Programming was the potential for "reuse". It did happen to an extent, but not to the level it was hoped for. 

So the idea with an Angular application, for example, is you would just go "shopping" for the services you needed in a catalog, and your Angular code would call those services to get the data you need, and send requests for work to be done, etc. And later someone could create a different application that needs some of that stuff, and just use those services. At a small scale it can work, but it introduces all sorts of coupling issues (your Angular app breaks because some team you never heard of made a change to a service that you aren't even using, but a service you *are* using uses and your app breaks.). It actually slows down our ability to ship code because now we have to do *tons* of testing and coordinate our releases across disparate teams.

Again, hindsight is 20/20, but thinking the *best* place to handle complex, asynchronous network communication is in a web browser really wasn't so bright of us. If your Angular applications are brittle, it's almost always because of that stuff. "In order to do this specific thing this application has to do, I have to call two different services, but then with the results of those two calls, I have to call yet another service, and when it responds, I have to do this other thing." That's hard enough to write, let alone the fact that this is where your error handling has to be the strongest, and it is the hardest to do. 

I often get students asking me for help on handling these complex scenarios, and I feel bad. I mean sometimes I can help a little, but we all felt that pain. We screwed up. The pain was so bad that most places have abandoned that idea and moved to a pattern called a "Backend for Frontend". It is outside the scope of this course to get into the details of this much, but we will talk about it some. It also has *great* implications on doing a rare thing in our industry: Simultaneously making your applications *more* secure, *and* easier to write. Those two things almost *never* go side-by-side.

### Good Reasons (Finally) To Do It

This one is simple. Simple to say, anyhow. It is simply this: Because it is your last resort. Because what you want or need to build just cannot be built with the stateless web application model.

OK. Clear enough. Moving on.

Just kidding. What would that *be*? I wish I were better at objectively stating this, but what you have to do is *think* and *feel*. 

What is the *feeling* or *vibe* of using a web application like Amazon.com, or Google, or Wikipedia? or YouTube? You know, clicking links, filling out forms, all that stuff. Those are *not* bad experiences. We will call these "Web Applications".

Ok, what is the *feeling* or *vibe* of using other applications, like Visual Studio Code? Excel? Notepad? We will call these "Apps".

I mean, you could have any number of answers, but certainly "Web applications feel like browsing the web, and the others don't" is pretty close to the top of the list for me. 

A geekier way of saying it is that what we call apps give the user more of an "unmediated experience of directly manipulating the application state". I'm *sure* that was on your list. (just kidding) But what I mean by that is if you take Amazon for example:

- I go to Amazon.com (don't need to install anything, I have a web browser!)
- I want to find a book a friend was talking about, and I sort of remember the name, so I type it in the search box.
- I know that some message was sent to the server, and they have some hamsters trying to figure out what I mean, and they send me a list.
- Dang, those hamsters are *good*! Right there, the first thing listed is that book. I click on it. This is me saying "Yeah, show me that thing". The hamsters go look it up and send me a *snapshot* of what they want to show me about it.
- I click on the "Add to Cart" Button, and the hamsters put it in a shopping cart for me for when I'm ready to check out.

Etc. etc. In other words, either consciously or unconsciously, I *know* there is a hamster there doing the real work.

And in this *domain*, that is absolutely fine. Perfect even. 

But if this was my development environment, or even a word processor, *I don't want no stinking hamsters*. In other words, *if* when I was in VS Code, every time I typed a letter, that meant a message had to be delivered across the network to a hamster that said "Oh, send a snapshot down that says we think they are going to type this next, and give them some code completion options" or whatever, that would not work and it would *suck*. 

### In Enterprise Environments We Build Applications To Get The Users To Do Something We Want Them To Do

We want them to use our application to buy more stuff, add vehicles to their insurance policy, etc. As a matter of fact, and this going to sound crude, but the "business value" of applications is when we can use them to do three things:

- Make us more money. 
- Limit our liability in some way.
- Convince users to do things that would normally be done by someone we are paying. *And like it*. 

That last one is *huge*. Think about how many times you are trying to do something online with a business you are a customer with and you wish you could just get someone on the phone. 

User interface, of the kind we are talking about here, is the art of convincing users to do something we want, while making it seem like we are doing something *for* them, as opposed to *to* them.

And user interface is the art of making that as simple and direct as possible, without the possibility of them making errors. Every error message you show a user is a *fail* in our world. You should always be asking "How can I create a situation where I don't have to have this user feel bad thinking they screwed up in some way?".

Let me say this more directly:

> If you are a developer creating user interface within a company, you are the most important developer there is. What you create *are the actual "Values", "Culture", and "Vision" of the company*. This is true for so-called "customer facing" applications, but also true for internal applications. If your applications aren't accessible to people with disabilities, I don't care what your "Values" web page says, you don't care. If you give me error messages because I entered my credit card number in the wrong "format" (uh, we don't allow spaces), then I don't care how much you *say* you "Value your Customers". If you make it hard for me to do anything, especially give you more money, you have messed up. Bad. Please take your job seriously.

And for *some of that* to happen, the only way you can do it is by creating applications that allow for the giving them the "unmediated experience of directly manipulating the application state". 

That means giving the appearance of *instant feedback* when the user does something. Not bundling up a bunch of their intentions, sending it to a server *later* just to send them back an error message. "Oh, you are signing up for our site? Cool. Give us your email address." You want them to sign up, right? Tell them *right then* if that email address is already in use. Don't make them fill out your huge onboarding form and them let them know they already have an account. 

At some point, the experience you want the user to have simply cannot be provided without going all in and becoming a professional user interface developer. And we will do our best to show lots of examples of this in class, but only *you* and your team can make that call.

**That** is when you should use something like Angular.

To be an Angular developer that means you have to:

- Understand Applications in the context of the WorldWideWeb. HTML, CSS, JavaScript, browser APIs, basic networking, all that.
- You have to understand the "Model" of your domain. No class, YouTube video, or Udemy course can do that for you. That's why the examples are always super general things like To Do Lists. If someone could write a sample application that is *perfect* for your business, for your domain, just buy that.
- You have to be thinking about User Interface and User Experience *all the time* and you have to defend it vigorously. And you will be wrong a lot of the time. Write your applications so that they get *better* as we learn more about our customers and what they want. 

And none of that has to do with whether you understand something like Angular Signals, or how to lazy-load components in routing, or the details of the TypeScript type system. Yeah, you need that stuff, too, but if you don't have those other things, your application will *suck*. It's better to have no application than one that is bad. 




## Angular Also Has Programmatic Interfaces

Way up there somewhere I made a big deal about "User interfaces being driven by users". That is the *most* important thing. But in our applications, our whole job is to make hard work invisible to the user. They don't know or don't care about the APIs you are calling behind the scenes to make the magic happen. And our applications are also *driven* by the APIs we call. We have to deal with that, too.

