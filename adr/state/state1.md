---
title: Server Data
---
# Working with Data (State) In Your Apps

We'll define **State** as the *current* value of all *variables* in the running instance of your Angular application.

State can be *ephemeral* (it comes and goes), or *persistent* (data stored somewhere between *instances* of your running Angular application).

## Ephemeral User Application Data

> [!TIP] For Some Examples of the Concepts Discussed Here
> See [Component and Server State](./1.component-state)



This kind of data has to do with our management of what the user is experiencing while running an *instance* of our application. In other words, a *particular* user is running our application on their device, and manipulates it through the UI affordances we provide to put the application in a particular *mode*.

Examples of ephemeral data *might* be:

- Values the user has entered into a form, before submitting the data.
- The current *mode* the application is in
  - This could be reflected in the route (e.g. "The user is in the mode of looking at the products and this is reflected in the URL displayed in the browser: `/products/list`")
  - Note: this is ephemeral because most users will enter the application at the *root*, and follow links, etc. to put the application in that mode. However, by putting the "key" to that mode in the URL, users familiar with web browsers can make a bookmark, or email the link to someone. In other words, by putting state in the URL we get persistence for *free* (more or less).
- User preference data
  - The user has decided to filter the list of products to only those that are in inventory.
  - The user has decided to sort the list of products by price, high-to-low.
- API Modes
  - The request to load the products is currently waiting (a `loading` state)
  - The request to add a product caused an error (an `error` state)

There are many more possible examples, but the common thing between these is this kind of state is always in the context of the user running the application. Many simultaneous, concurrent users of the application will have different values for these things.

The base level of this kind of state in our application is held as *component state*. For example, you may have a `Signal` that holds their current sort criteria for a displayed table of products. Or you may be using a form within a component. The important thing here is that when that form is created, those values are initialized to their defaults, and when it is *destroyed* (e.g. they navigate to another route) that data is lost.

In both of these examples, we are relying on the user to duplicate their efforts to recreate the state. 

- They are in the process of filling out a form, and visit another route in the application (maybe to check a notification or look something up). When they return to the form, it is empty - it has lost everything they previously entered.
  - Note: I have seen some developers try to use techniques to make forms "modal". What I mean by that is using some mechanism (like maybe a `canDeactivate` route constraint) to keep the user from leaving the form without acknowledging they know they will lose the data. Generally, I find this an anti-pattern. It is annoying, confusing, and can't provide the level of protection you may think it does (for example, they can always just refresh the page, or use a bookmark or manipulate the URL in the browser).
- For things like sort and filter, again, those will have to be reset each time they visit the component. 

Many of these things can be "graduated" from ephemeral to persistent, based on the needs and the desired user experience of the application. 


## Persistent User Application Data

We can decide to make this ephemeral user application data persistent between uses of the application. An example of this might be the sorting preferences for a list of data. We can persist their choice *somewhere* so that the application "remembers" the user likes to sort data in a certain way. 

The "length" and "scope" of this "memory" is under our control.

### Application Instance Persistent User Application Data

Maybe we decide that while the user is running an instance of our application, some data will be persisted across the application outside the life of the individual components that need that data. This is accomplished using Angular *services*. (You can read more about [Services](./services/index)) here)

To accomplish this we *lift* the state that was *owned* by the component into a service that is *injected* into the component. The service (by default) will be *created* when it is first injected, and will stay in memory (depending our where and how we have *provided* that service) longer than the component (or components, or even other services) are "alive".

- The `Signal` that holds the sorting preferences can be moved into a service.
- The *dirty* (unsubmitted) values in a form can be *streamed* on changes to a service to hold those values, and when the component is created, the values on the form can be reset from the service itself.

This is fairly easy to do, but the main limitation is that this data, still, will only *live* as long as the application instance. If the user closes the app, reloads the app, or moves to another browser or device, this data won't be available.

### Application Instance Persistent User Application Data Per Browser

The next level of persistence is using a browser API to persist state in a durable way on the users device. The benefit of this would be that when the application restarts, it could check for this saved state and "rehydrate" the state of the application.

- When you change your sorting preferences, it is stored in a browser's storage. When the application starts again, or the service holding this state is initialized, it checks to see if there is an archive of that state in the browser, and if so, sets that as it's current state.
- When you are filling out a form, the current state of that form can be saved to a browser's storage, and retrieved again on the next instance of that application.
  - You probably would want to reset/delete that state when it is "transferred" from being ephemeral user state. What I mean is, after the user successfully submits the partially completed form, you remove it from the browser's storage.
  - Note: I usually don't store intermediate values in a form in a persistent way like this. I just use a service, but there are times when this is useful and maybe required.

#### The Browser Storage APIs

There are many standard ways to persist data in a browser. These include cookies, the WebStorage APIs, and IndexedDb. I don't use cookies for this often, so:

##### `WebStorage`: There are two different "backing stores" for the WebStorage API in browsers.
  - `sessionStorage`: Persists data just while that browser tab is open. It is automatically removed after the tab is closed. This isn't used much in apps like we build with Angular, because we have the option of using stateful services.
  - `localStorage`: Has the same API (synchronous, key-value store where the key and the value are strings) as `sessionStorage`, however it is written durably to a file on the users device.
    - Keep in mind that *each browser* has it's own storage. If a user uses Google Chrome, and then switched to Edge, FireFox or Safari (or any other browsers), those browsers only have access to their own values.
    - This data is usually kept (it is up to the browser) in the users profile, so it is *possible* it will be synched across machines, but it is unreliable at best.

##### `IndexDb`: An *object* database included in browsers. 
  - It is *indexable*, and can store complex graphs of objects.
  - It includes mechanisms for *versioning*, which can eliminate problems (discussed below) with other approaches, but also requires more code and complexity.
  - It is, like `WebStorage`, scoped to a browser (not a user, per se.)

While using either of these techniques are arguably *easier* than what we will discuss next (persistent User Data from a Server), there are several considerations to keep in mind. 

- Security
  - The data stored in either `localStorage` or `IndexDb` is transparent to the user. They can use the built in dev tools in their browser to inspect and even modify this data.
  - It is available only to code that comes from the same *origin* that placed it there. For example, data stored by an application that originates from `https://www.company1.com` is only available from code delivered from that origin. If another application from `https://www.evil-empire.com` is loaded into the browser, it will not be able to access that data.
  - Who is the "user"? We are not, at this level, creating a concept of a "user". With these techniques, "User" is defined by "the person logged into this particular browser running our application". This might be fine in a corporate environment where each user *should* be using applications after they have logged on with their own credentials (storage is per user, per browser, per machines). But if there is a chance (and there usually is a chance) that multiple people will be using the same browser, logged on as the same user, there is no protection from this. The cliched example is users accessing your application from a browser in a library, but this also applies to many home users as well. 
- Drift (Schema, Migrations, Etc.)
  - A big problem is that the data stored in a browser might have been stored using a different *version* of the application than the application trying to *read* that data.
  - An example would be the user sets their sorting preferences by using the application on May 1, 2025. It stores some data in `localStorage` as `localStorage.setItem('sorting-preference', 'by-price-low-to-high')` Later you change the logic for this in your application, to store (and expect to load that data) like this:  `localStorage.setItem('sorting-preferences', JSON.stringify({by: 'price', direction: 'low-to-high'}))`
  - You can probably see how this might cause problems, is easily missed in testing, and would require some validation and a backup-plan for older versions when the user starts the application *after* you deliver the new version.
  - `IndexDb` requires data to be stored with a specific version, and provides a way to migrate data to newer versions in these instances.
  
One *big* advantage of this approach is no network access is required for these techniques. Your application can, if you desire, be delivered as a "Progressive Web App", and won't even need a network connection to retrieve and set this information. 

## Persistent User Data From Server

Instead of storing the data on the users device, as above, that data can be stored in an API that is accessed by our application. These minimizes many of the issues with **Application Instance Persistent User Application Data Per Browser**, above, but obviously introduces additional complexity and coupling.

It allows the state to be shared across instances of the application, different browsers, and different machines.

You wil have one API that works as the "store" for all data for all users of your application. 

The user must be identified in some way - e.g. your application has to make a request to get the stored data for the user currently running the application. You will need to have an authentication scheme. A common way to implement this in an API is to use a "Store" API archetype. A "Store" is an abstraction that allows us to "mirror" local application state at the server. 

And example HTTP flow of this might look like this:

### Your Application Requests the User Store

After authenticating your user (various techniques, e.g. cookies, OIDC, Oauth2, JWT, etc.), you make a request to the store like this:

```http
GET https://api.some-server.com/user-prefs
Authorization: (value of the authentication, like an access token)
Accept: application/json
```

The server reads the value from the `Authorization` header, verifies it, and extracts the identifier from this user. It uses that to retrieve the settings from some storage (database) and makes a response.

```http
200 Ok
Content-Type: application/json

{
    "sorting-preference": {
        "by": "price",
        "direction": "low-to-high"
    }
}
```

Every time the user changes some of this state, it needs to be "synched" with the server (usually behind the scenes, transparently to the user).

You can get some *drift*. If the team that "owns" the prefs store (`https://api.some-server.com/user-prefs`) deploys at a different rate than your application and introduces breaking changes, it can impact your application. (for example, they change the resource: `user-prefs` becomes `prefs`, or they change the structure of the response, like deleting a property, or renaming a property). 

Since these preferences are about both a *user* and a specific *application* (yours), I recommend the same team that owns the Angular application also own this API. They can be deployed (and therefore tested) together.

You *can* also have *concurrency* issues. For example what if the same user is logged into your application from multiple devices and/or browsers (for example, they have the application open on a laptop, and on a mobile device). This can create a "last one in wins" problem. Frankly, for preferences stuff like this, it isn't usually that big of a problem, but it can be with other kinds of state (below).

Additional Recommendations:

The HTTP response for preferences like this should contain a cache-control header of `no-cache`:

```http
200 Ok
Content-Type: application/json
Cache-Control: no-cache // [!code highlight]

{
    "sorting-preference": {
        "by": "price",
        "direction": "low-to-high"
    }
}
```

If you are concerned about concurrency, use periodic polling to refresh the data from the API (or use Server Sent Events or Web Sockets, discussed below). Make sure you disable the polling while you are updating the data because of changes on the client, though. You can get lost updates.

## Read-Only Reference Data

## Ephemeral User Application Data

> [!TIP] For Some Examples of the Concepts Discussed Here
> See [Outbox Pattern](./2.outbox)



We build applications so that our users can accomplish things we want them to accomplish. For example, if we are writing an e-commerce style application, we want them to buy products. In order to do the thing we want the to do, we usually have to provide them supporting data for making that operation, or deciding if they'd want to. So, I can't place an order for something unless you know what that *something* is. What is the price? When will it ship? What are the reviews, etc.

This supporting "reference data" is what enables our users to *do things*, or *find things* they need to do business with us. 

- Finding Things
  - This is data that is provided to the user as a convenience, but is not used as an *operand* in an *operation* provided by our application. For example, we might offer a list of locations for our brick-and-mortar retail stores as a convenience to our user. If the rate of change of this list of locations is independent from the rate of change of our compiled application, it should be provided by an API through a late-bound call. 
    - If it is not independent, in other words, it doesn't change at a different rate than our code, it *could* just be hard coded into our application itself. 
  - We may provide affordances for the user to filter the response (for example, allow them to choose only locations in their city or state), but of course the API would have to support this, *or* we could simulate this for them locally by retrieving the entire list of locations and filtering it locally.
  - Keep in mind HTTP API responses are a *representation* of a resource at a specific *point in time* (i.e. when the response was sent to the client). If the user keeps the application open with the location list in a browser tab for an extended period of time, the list might drift from the point of truth provided by the API. You may need to periodically refresh the data for the user.
- Doing Things
  - This gets more complicated, and is maybe more common than the "Finding Things" scenario. Let's break this down more thoroughly.

### Doing Things With State

Let's say we are building an Angular app that allows the user to purchase tickets for a performance at our theater.

Our applications reason for existing is to allow users to buy tickets (and therefore we make money).

```
The user Bob Smith
Would like to buy tickets for Taylor Swift's Era Tour Performance, Tuesday, June 24, 2024
The user, Bob Smith, would like the following seats:
    - 23 A
    - 23 B
Bob Smith would like to use their stored credit card information, with the id of "us-bank-visa", the calculated amount of $424.83
```

Perhaps this could be represented in an HTTP POST request like this:

```http
POST /user/ticket-requests/tswift-era-7-24-2024
Authorization: (access token for Bob Smith)
Content-Type: application/json

{
    "desiredSeats": [
        "23 A",
        "23 B"
    ],
    "paymentChoice": "us-bank-visa",
    "agreedUponPrice": 424.83
}
```

It's useful to think about the *command* in terms of all the possible *errors* we could get when we send it to the server for processing, and then think about how we can minimize the chance for errors (we don't want to say no to their money!).

*Some* possible errors:

- We don't have that performance scheduled
  - Where are we indicating the performance? In the URL (`/user/ticket-requests/tswift-era-7-24-2024`). The appropriate HTTP response for this would be a `404`. 
  - For example, if the user wanted to request tickets for the June 25, 2024 show, but there was no show scheduled for that, doing a post to `/user/ticket-requests/tswift-era-7-25-2024` producing a 404 would mean "We don't have that to offer."
- The user is unknown
  - The value in the Authorization header is either missing, invalid, or no longer good. 
  - The API would most likely return a 401 status code, with a challenge to log in again.
- The user is known, but has specifically been blocked from any performances for Taylor Swift.
  - We know who you are, but you can't do this. This is Authorization. The standard response for this would be a 403 status code.
- The user's credit card is bad, or authorization failed in some way.
  - The reference we sent for their credit card to charge (`us-bank-visa`) could be non-existent (maybe it did at one point, but the user removed it?)
  - The credit card referenced wasn't able to be processed
    - This is a big topic I'll touch on later in asynchronous processing, below.
  - Generally, though, if there is a problem with the *entity* being sent (the JSON body of the request), you would send a 400 Response (Bad Request).
- What if those seats aren't available?
  - If while the user was building up this command, the seats were taken by someone else?
  - Again, a whole can of worms here, but we can sprinkle a little nuance on this:
    - We could say "Those seats aren't available (or one of them isn't), but there are still other seats available. Do you want to try again?"
    - We could say "No seats are available. This show is sold out."

There is a *lot* the server will have to do to process this request. Some of it is fairly "easy" - like the `Authorization/Authentication` bit, and just verifying (validating) the "shape" of the request entity, or the presence of that show. 

I used this silly example of buying tickets for a Taylor Swift show intentionally - as a sort of hyperbole. As you may or may not know, *those tickets go fast*. There are *thousands* of concurrent users competing for tickets. 

The state we have in our application that provides the user the ability to issue this "command" is volatile. We will have to provide them reference data (read models) to guide them through creating that command.

- They will have to have a user account to purchase tickets. *We* need to know who they are.
- They will have to have a payment method provided to pay for any tickets.
- They will need a list of upcoming performances (this will provide the `tswift-era-7-24-2024` portion of the the URL for the command).
- They will need a list of the seats that are currently available for that specific performance so that they may make a selection.
- We will have to give them an *estimate* (at least) of what they should expect to be charged should they "pull the trigger" and request the tickets.

And, again, once they do, the "server" will have to verify all of that.

There are a lot of things that can go wrong, and that number is a product of the level of concurrency (how many people are buying tickets) and how long it takes *this* user to issue the command to purchase the tickets at the server.

#### Commands or "Who's Transaction Is This, Anyway?"

One way to model this as a transaction is to say something like:

- If the User Is Valid
- And If The Credit Card Is Valid
- And If the Show is Available
- And If the Seats Are Available
- And If the Cost is What You Expected
- Then You Get The Tickets (they are reserved for you, won't be sold, your credit card is charged, etc.)
- Otherwise you lose. Start over.

Again, this is all based on context. The formula for failure is something like `Concurrency * Rate of Change * Time = Chance of Failure`. 

As you can imagine, this would create what the UI/UX experts call a "sucky experience". The user keeps trying to buy tickets, and each time they are told "sorry, those tickets are no longer available, try again?" and they have to go through the create process of creating a new command again.

The astute reader may have noticed I did something sneaky in this command, though. The user is not commanding the system to purchase a ticket, it is requesting a ticket. 

The *operation* the user is requesting is to create a ticket request. This is reflected in the method and URL (`POST /user/ticket-requests/tswift-era-7-24-2024`). This puts this command in the "box" of requests for tickets for a specific user. 

*If* we had made the operation be "owned" by a resource other than a user, we would be really limited. A *bad* API designer, who has a mind full of "CRUD", might model this something like:

```http
POST /tickets
Authorization (User's Access Token)
Content-Type: application/json

{
    "performance": "tswift-era-7-24-2024",
    "desiredSeats": [
        "23 A",
        "23 B"
    ],
    "paymentChoice": "us-bank-visa",
    "agreedUponPrice": 424.83"
}
```

If you think about it for a second, that *doesn't even make any sense*. In HTTP, we expose *resources*. Here the resource is "tickets". This kind of resource in HTTP is sometimes called a *collection*. In other words, the API designer here is saying that it "owns" a collection of tickets. What would that look like if you did a `GET /tickets` request? Return an array of all the tickets for every show ever sold? Nonsense. And *certainly* that array wouldn't be a bunch of things that look like the entity we are posting in the request. 

What we did is say that the operation we are allowing is for a *user* to create a *ticket-requests* for a specific *show*. (again, `POST /user/ticket-requests/tswift-era-7-24-2024`). 

Of course, ultimately, we are hoping that this request will turn into a *ticket* or *set of tickets* for a user. But when we do a `POST` to a collection resource we are saying to that resource "Please consider creating a new *subordinate* resource in your collection, based on the data I am sending you.".

With the `POST /tickets` it is very *binary*. "I, the *tickets* resource, can only return a success status code if everything checks out". By creating the *store* resource, we have much more flexibility, and that makes it more actionable for the user should something go wrong.

Let's be optimistic. Let's say that those seats are available, and everything checked out. After the POST, you might get a response like this:

```http
201 Created
Location: /user/ticket-requests/tswift-era-7-24-2024/1
Content-Type: application/json

{
    "id": 1,
    "status": "Purchased",
    "seats": [
        "23 A",
        "23 B"
    ],
    payment: {
        "instrument": "us-bank-visa",
        "amount": 424.83
        "transactionId": 9938898983
    }
}
```

Of course, this could be reflected in *other* potential (or existing) resources available through the API:

```http
GET /user/ticket-requests/twsift-era-7-24-2024
Authorization: (user's access token)
Accept: application/json
```

Would return *all* the ticket requests this *user* has made for *this show*. 


You could easily add, if needed, something like:

```http
GET /user/ticket-requests/
Authorization: (user's access token)
Accept: application/json
```

Which could return all of the requests they've made for any tickets for any show.

And of course, it could be added to a more "shared" collection like:

```http
GET /shows/tswift-era-7-24-2024/purchased-seats
Accept: application/json
```

And

```http
GET /shows/tswift-era-7-24-2024/available-seats
Accept: application/json
```

But just as importantly, if there is a *problem* with processing that particular *ticket request*, it can still be a *thing* (read, "resource").

Let's say that the seats are not available that the user selected. After `POST`ing the command, it could return something like:

```http
201 Created
Location: /user/ticket-requests/tswift-era-7-24-2024/1
Content-Type: application/json

{
    "id": 1,
    "status": "AwaitingSeatReselection",
    "seatsRequested": [
        "23 A",
        "23 B"
    ],
    "seatsAvailable": [
        "23 B"
    ],
    "alternateChoicesToSuggest": [
        ["23 B", "23 C"],
        ["26 A", "26 B"]
    ]
    "payment": {
        "instrument": "us-bank-visa",
        "amount": 424.83
        "transactionId": 9938898983
    }
}
```

Here, in this made-up scenario, when the user submitted this request, the server wasn't able to create a ticket for th show because the particular command couldn't be fulfilled because one of the seat they wanted (23 A) was no longer available.

The response shows this pretty clearly with the `status` message, and then includes which of the seats they requested is actually available (23 B), and then suggests some alternate choices the user might try.

> [!NOTE] 400 Responses Aren't Very Actionable
> Returning a 400, while it *can* contain data in the response, means that the request couldn't be processed. Here we aren't going to return an HTTP error status response (unless the URL is bad, the user isn't authenticated, etc.) we are *always* going to return a success status code, but the entity returned will be able to express the *state* of that resource - here, a `ticket-request`. Think of 400's as you asking the server to do something, and it punches you in the nose and says "nope. try again, loser!". Here, this pattern, which is pretty standard, says "Yeah, I was able to create a ticket request, however, here's why it can't become a ticket yet, and here are some ways you can fix it.". This isn't as weird as you might think at first. This idea of having a "user thing" that becomes a "server thing" over time is all over the place. Your shopping cart at a web site is a "user store" shopping cart, that (hopefully) becomes an order. You might get a quote for car insurance (user has a quote), but you aren't insured until the server takes ownership of that and makes it a "policy".

### Operations and Operands: References and Embedded

Since we use Angular to create *applications*, they are usually sorted around exposing what we could call "operations" the user can create. I have seen *some* Angular (and React, and Vue) "applications" that were strictly read only data. It did not expose any operations for the user to perform based on that data. I personally feel that using a framework like Angular to create something like this is overkill, but they are the exception, not the rule.

Hopefully without belaboring the point, Angular applications represent the set of operations a user can perform on our "backend". They are the *interface* a *user* interacts with to change the state of our "business". 

Some of these interactions, which we'll call *operations" or "operators", have to do with just the running instance of the application. An example would be to have an operation that allows the user to see a list of upcoming performances. This would most likely be exposed to the user as a link to a `route`. This operation would likely trigger an API call to get the list of upcoming performances.  That list is likely presented the user so that they can perform additional operations. They may want to see what seats are available for that performance, for example. They may want to add it to their "wishlist" of upcoming performances (allowing, perhaps, us to market to them directly about it), or they may want to see the whole thing through and purchase a ticket for that performance. 

From the *persona* of "A customer looking at performances in order to buy tickets", there is a lot of *reference data* they need to perform the operation of requesting tickets. "I'd like a ticket, please" is a pretty paltry operation. We'd need to know for what performance, what seat, who are you, how are you going to pay, etc. 

While there aren't always "hard lines" drawn between *ownership* of reference data, there *should be* in the context of an operation.

From the example above, repeated here:

```
The user Bob Smith
Would like to buy tickets for Taylor Swift's Era Tour Performance, Tuesday, June 24, 2024
The user, Bob Smith, would like the following seats:
    - 23 A
    - 23 B
Bob Smith would like to use their stored credit card information, with the id of "us-bank-visa", the calculated amount of $424.83
```

In the context of this persona ("A customer looking at performances in order to buy tickets"):

| Narrative | Operand | Notes |
|-----------|---------|-------|
| The User Bob Smith | Authorization Header | A reference to an access token from the identity server |
| Taylor Swift's Era Tour, Tuesday, June 24, 2024 | In the URL | A reference from a shared list of upcoming performances |
| Seats 23 A, 23 B | In the Entity | A reference to seats that were available when building this operation |
| Credit Card (us-bank-visa) | In the Entity | A reference to an existing credit card owned by the user |

Looking at this operation, perhaps we could call it "Create Ticket Request", we are saying that in order to do this, you have to give us some data, and this data must be something that "exists" somewhere else. That is was we call an operand that is a *reference*.

In other words, these operands are references to *other things* that can be (and should be) verified when the operation is being processed. For example, a request that sent in the `requestedSeats` array an element that simply had the value "front row, baby!" probably wouldn't resolve to an *actual* seat. Additionally, if the seat requested did refer to an actual seat, we'd have to make sure that the seat is *still* available at the time of processing.

Let's start by looking at one particular operand that is a reference in this request, the `Authorization` header. Let's assume we are using a bearer token in the form of a JWT (JSON Web Token - A common format). If we were using a JWT for our `Authorization` header, it might look like this example:

```http
POST /tickets
Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

// rest elided for clarity
```

That value in the authorization header is not an "Id". It is not just a simple reference to a user that the system knows about. I mean, that's how we treat it, logically, but it contains much more information than that.

> [!NOTE] That JWT is Just a Sample
> You can see it at [jwt.io](https://jwt.io)

Without getting into the weeds of OIDC, and Oauth2, etc. what this means is the user is identified by another server (read: resource), the user is verified at the time of login (or refresh) to be a valid user. In order to trust this, our API has to have a way of verifying that this JWT came from an *issuer* that we trust, and hasn't been tampered with, and is *still valid*. There are a *lot* of mechanisms for doing this, which are beyond the scope of what I'm trying to show here, but basically, our server needs to have a way of trusting this information, and be able to make decisions on how long this reference should be considered reliable.

Embedded in that JWT would be the *actual* identifier (reference) to a user, which is canonically in JWTs the `sub` claim, embedded in the "middle" section of the JWT. If you look at the decoded JWT it looks like this (again, you can see this at [JWT.io](https://jwt.io)), and I'm just showing the "payload" section here:

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

This *payload* has three *claims* attached to it. The first is the `sub` claim, which is the "id" of this user. It is unique to all users from the issuer of this claim. This also has a `name` claim, for convenience, and then an `iat` claim. While there are other more sophisticated ways of doing this, this is a good "minimal example". The `iat` claim is when the claim was issued. ("Issued At" == 'iat'). It is a unix timestamp. This one decodes to (again, just using the provided sample), Wednesday, January 17, 2018 at 20:30:22 GMT. 

> [!WARNING] I am not giving advice on security here, Just using this as an example!

So, when the API processes this request, it will have verified this was issued from an issuer it trusts, but that happened *in the past*. In this example, the server could say "You know, you haven't logged on and verified your credentials since 2018. Not sure I can trust this!"

Generally speaking, the point here is that in the example of an Authorization header, it contains a reference, and some kind of *version* embedded in it. 

To see an example of how this might be a useful pattern, imagine an operation like this:

```
An esteemed user wants to purchase a car through our application. 
They have found the car they like, the price is right, they talk it over with their spouse at dinner, and then decide to purchase it
```

So, we can imagine this in terms of a series of HTTP Requests for reference data, culminating in a *side-effect* operation to purchase the vehicle.

#### Seeing the Inventory of Vehicles

The user navigates to a route that allows them to see vehicles that are currently for sale.

Behind the scenes, a request is made to get the list:

```http
GET /vehicles-for-sale
Accept: application/json
```

They receive back:

```http
200 Ok
Content-Type: application/json

[
    { "vin": "93839893", "make": "Ford", "model": "Bronco", "year": 2021},
    { "vin": "39839898", "make": "Subaru", "model": "Forester", "year": 2008}
]
```

From the displayed list, the user wants to see more details about the Bronco. They click a link in the application that takes them to a component that makes the following request:

```http
GET /vehicles-for-sale/93839893
Accept: application/json
```

If they waited too long before choosing from the list, they *could* get a 404. Perhaps you removed it from the API because someone else purchased it. But assuming it is still available, they might get:


```http
200 OK
Content-Type: application/json
Date: Sat, 17 May 2025 18:31:39 GMT

  { 
    "vin": "93839893", 
    "make": "Ford", 
    "model": "Bronco", 
    "year": 2021, 
    "mileage": 18232,
    "price": 18230.82,
    "photos": [
        "/images/8d893.jpg",
        "images/38983.jpg"
    ]
}

```

This response has more details (mileage, price) and some *references* to some photos. 

You may also notice I added a header that *all* HTTP responses *must* have, the `Date`. This is the date when the response was created. We'll come back to this in a bit.

So, maybe you display this to the user, show the pictures, all that stuff, and there is a button labeled "Buy This Ford Bronco" at the bottom.

The user opens another browser tab, looks for the blue book value, does some research, thinks about it (in other words, time passes). Finally, they decide to do the operation: Buy the Vehicle.

Maybe that results in the following HTTP Request:

```http
POST /user/purchase-requests
Content-Type: application/json
Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

{
    "vin": "93839893"
}
```

Leaving out some details we've covered above (we'll assume a payment method is on file for that user, all that jazz), what could go wrong here:

1. The vehicle has sold already. Not much we can do but tell them as much, and maybe suggest some other cars they might like.
2. The price has changed since the user originally looked at it (which was Sat, 17 May 2025 18:31:39 GMT).
   1. The price could have gone down.
   2. The price could have gone up.

It's that second one that is the most avoidable "sucky user experience". Old-Skool transactional thinking would say that you just *reject* this operation. But how would you even *know* when processing the request that the price was different from when the user decided to perform the "purchase" operation? Best case, they may be pleasantly surprised (if not confused) because they actually were chared *less* than they were expecting, or absolutely *outraged* because they were charged *more*. We could even be in some legal trouble here.

We can't (as we sort of naively did with the Taylor Swift Tickets) just *embed* the price the user is expecting to pay in the request. That isn't *our* data, and is open to compromise, all sort of bad things could happen.

If you asked the "business" how they might want to handle this, they might give you all sorts of *nuance*, and a lot of *it depends* answers.

For example:

- Well, if the price *now* is *lower* then give them the lower price. 
  - Perhaps, more unethically, charge them the higher price, since that's what they agreed to!
- If the price *now* is *higher* than when their agreed:
  - Let them know, and ask if that is ok.
  - Unless it is a request by an *esteemed customer* (defined by average monthly purchases or something), then:
    - If the price change from *then* (when they saw the car) and *now* is less than two hours apart, give them the lower price.
    - If the price change from *then* and *now* is less than 5% of the current price, give them the lower price, regardless of the time delta.

> [!NOTE] What Amazon Does
> If you add an item to your cart, and when you add it, it is, say $13.99 but when you check out, it is $23.99, you pay $23.99. 
> *Always* look at the price displayed on the screen where you "Place Your Order" - it may be different than what you thought you were agreeing to.
> This is *another* reason the User Store archetype (like `/user/ticket-requests`, or `/user/purchase-requests` can be helpful)

That's all great, but we still need a way to say the operand (the `vin` here) *refers* to a vehicle at a specific point in time that *maybe* had a different price, etc.

We *could* change the operation to look something like this:

```http
POST /user/purchase-requests
Content-Type: application/json
Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

{
    "vehicle": {
        "vin": "93839893",
        "retrievedAt": "Sat, 17 May 2025 18:31:39 GMT"
    }
}
```

So the operation "Create Purchase Request" says the user indicated by the Authorization header would like to purchase the vehicle with this VIN, if the business rules say that the *current* state of that vehicle matches what the *past* state of that vehicle is based on the date and time it was retrieved.

It would take a bit of clever coding on the server side for this, but it might be as simple as adding a `timestamp` field in the database that is updated every time the the table or document is updated.

So, some pseudo-code for the server side might look like this:

```
var vehicle = sql("SELECT from Vehicles where Vin = '93839893'")
if(vehicle is null) {
    return NotFound();
}
if(request.vehicle.retrievedAt != vehicle.timestamp) {
    return BadRequest('Refresh that vehicle, the price changed')
}
```

This wouldn't (yet) allow us to to implement the "it depends" logic from the business, but we wouldn't get in trouble if there was a price change.

We'd have to have a way to keep track of different *versions* of the vehicle over time. So, again, some *bad* pseudo-code:

```
var vehicle = sql("SELECT from Vehicles where Vin = '93839893'")
if(vehicle is null) {
    return NotFound();
}
if(request.vehicle.retrievedAt != vehicle.timestamp) {
   // look up the price somehow at the time when the vehicle was retrieved, and the current price and apply the rules
   var agreedUponVehicle = vehicleLookup.GetVehiclePriceAt(request.vin, request.retrievedAt);
   if(agreedUponVehicle.price > vehiclePrice) {
    // do it, give them the lower price.
   }
   if(agreedUponVehicle.price > vehiclePrice) {
    if(user.isEsteemedCustomer()) {
        // etc. etc. 
    }
   }
}
```

> [!TIP] This is where patterns like Event-Sourcing Shine
> Most Event-Sourcing implementations let you recreate the state of a representation by replaying the events related to that representation up to the current time, or even an earlier time or "version" number.
> That ` var agreedUponVehicle = vehicleLookup.GetVehiclePriceAt(request.vin, request.retrievedAt);` line in the pseudo code is *trivial* to implement with event sourcing. Not so much with standard relational databases, but still not impossible. 
> With `Marten`, my "go to" Event Sourcing framework, it would look something like `var agreedUponVehicle = await session.Events.AggregateStreamAsync(request.vehicle.vin, request.vehicle.retrievedAt)`


Using Dates and Times for this kind of thing might get your spidey senses tingling. There is *so much* that can go wrong with that. If you think about it, we are just representing a *version* with that date and time. It might be the same version now (when the operation is processed) or it might not be.
You may find it easier to just put a "version" identifier in your response:

You could either put it in the entity like so:

```http
200 OK
Content-Type: application/json
Date: Sat, 17 May 2025 18:31:39 GMT

  { 
    "vin": "93839893", 
    "version": 1,
    "make": "Ford", 
    "model": "Bronco", 
    "year": 2021, 
    "mileage": 18232,
    "price": 18230.82,
    "photos": [
        "/images/8d893.jpg",
        "images/38983.jpg"
    ]
}

```

And then the operation would look like this:

```http
POST /user/purchase-requests
Content-Type: application/json
Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

{
    "vehicle": {
        "vin": "93839893",
        "version": "1"
    }
}
```

At the server, you could increment the version for each modification, and keep a history of different version of the resource (or, again, use Event Sourcing, where this is sort of built in). 

> [!NOTE] HTTP Uses a Similar Technique For Concurrency
> "Versions" in HTTP are called "entity tags", and are put in an `E-Tag` header. Using this you can do *conditional gets*, and *conditional operations*, This can be utilized for what we are doing here, as well, and is actually more "standard", but more unwieldy to work with generally, I find.

## Keeping Data "Fresh" in Your User Interface

Whether you like to admit it or not, if you are creating Angular applications, you are creating distributed applications. In an Angular application some of the functionality is implemented in the browser, and some is implemented in your API (or APIs). 

More importantly, you are going to end up with multiple copies of the same data spread across your distributed application.

- There is data likely in your database. This is the only "real" data that can be counted on. Everything else is a copy (a cached version)
- There is data in your API as it processes requests and operations (The JWT example here is good - "I see 10 minutes ago, this user was good, according to the Identity server, that's good enough for me - or it isn't")
- Some of the data is sent to your Angular application as reference data. 

These are the issues that are pointed at by the examples in this document, right? 

- "You told me *then* that these seats were available for the Taylor Swift show, but *now* you are telling they aren't?"
- "You said this Ford Bronco costs this amount *then* but now you charged this amount *now*"?

First, a hard truth: There is **no way** to fix this problem. You can *minimize it*, you can *accommodate it* but you can't remove it.

> [!TIP] Tip: Treat ALL data as "cached" and suspect.

### Be Clear About Data Ownership

Data that your application doesn't own *must* be treated as *immutable*. You are *not allowed* to make changes to data that you don't own. Periodt. Reference data is data you don't own, therefore, data you don't own should alway be an operand in operations that is a *reference*. 

But ownership varies based on context. This is where it gets hard.

For example, there would probably be an app *somewhere* that allows the theater owner to add new shows to the calendar. There would be an app or feature *somewhere* that allows the dealership to add cars to the list of vehicles that are for sale, and make changes to their prices, etc.

In Angular, the only data your app "owns" is the stuff we talked about way at the beginning of this document - User Application Data. This is data that no other application will ever access or change. It's all yours. Go crazy.

For *everything* else, really, it's the service (API) that provides that data that *owns* that data. 

Your application should *never* modify data from an API directly. Of course you *can* - we are programmers, we can do all sorts of evil things - but *don't*. 

Some Examples:

Suppose you are making a "Todo List" application. The list of items to do are stored at an API. You retrieve the list of todos for the user at some point, and give them affordances to mark todos as complete, edit the description, or remove them from the list altogether. 

You may *cache* this list in a data structure in memory to allow the user to sort, filter, etc. after retrieving it from the API, but don't modify it. 

If, for example, you decide when a removes an item from the todo list, you'll remove it from the list, and *then* make a call to synchronize the server's version with yours. For as long as the HTTP request takes, your version of the list will be different than the servers. And what if the request fails? You will be showing them a *lie*. Maybe not a big deal on a todo list, but probably not something I'd want my bank, for example, doing. 

#### Pessimistic Updates Are The Best Plan

In this case, with the todo list, it would be *best* if you implemented it as starting with the API call (maybe `DELETE /user/todo-list/99`). *After* you get a success status code from the server, you can do one of two things, in order of preference:

1. Invalidate the cache copy of the todo list you have in your app, and request it again.
2. Remove it from the cached copy of the todo list, without requesting the data again.

The advantage of #1 is that you would also get any *other* changes that might have happened to that list since you last requested it (maybe the user added, edited or removed something on another app?).

The *downside* of this, of course, is if you have a slow response time (your API is slow, the network is slow, etc.) it can create a *sucky user experience*. You can try to hide it with cute animated "please wait" gifs or whatever, but it is still going to be rough.

#### Optimistic Updates Are The Devil

There is a *lot* of discussion in the web development community about doing optimistic updates. And none of them are good, in my opinion.

What is meant by "optimistic update"? It's "lying". So, for example, if a user adds a todo to the todo list (or deletes one, or edits one, whatever), you *first* modify the local cached copy, and *then* you send the request to the server. 

When the request to the server succeeds, you may be "done", or you may have to update/replace the "fake" version you added to the list with the version returned from the server.

Let's use the "add a todo" operation as an example:

Again, pseudo-code:

```ts
const todoToAdd = { description: 'Mow Lawn'};
const fakeTodo = { id: crypto.randomuuid(), description: todoToAdd.description, completed: false};
cachedTodosService.add(fakeTodo);

httpClient.post('/user/todos', todoToAdd)
    .pipe(
        tap(r => {
            cachedTodoService.remove(fakeTodo.id);
            cachedTodoService.add(r);
        }),
        catchError(() => {
            cachedTodoService.remove(fakeTodo.id);
            // notify the user.
        })),
    ).subscribe();

```

You might get away with it. I've done it in the past, and it's worked, or it didn't. The user could close the browser before the request completes, and not know it didn't work. They "see" the Todo show up in their list of todos, they trust that, and they are done.

The other issue is that the "fakeTodo" isn't a *real* todo. It *cannot* be used as an operand in any operations. While it is in that "pending state" (waiting for the server to return a value), we can't do *anything* with it. We'd have to disable the "mark complete" and "remove from list" buttons, because those would need a *reference* to this todo, which would be ID assigned at the server, most likely. And even if you let the client (here, our Angular application) decide on the Id for this, (using that `crypto.randomUUID()` function), the HTTP request to add this to the resource might not finish before the user tries another operation on that todo. (They add something, you send it to the server, pending a response, and then they try to mark it complete. When that call to the server to mark it complete is sent, that todo might not yet exist at the server - the database insert might not have completed).

This does *not* mean that we *always* have to do pessimistic updates, though. Frankly, I rarely do. But I also *vehemently* follow the rule that I don't modify data I don't own.

#### Use an Outbox

Consider any pending changes the user makes to server state as *ephemeral user application state*. 

Basically, you create one "box" that contains the immutable data from the server. Nothing in this box can be changed. 

Create another "box" that has all the pending changes the user wants to make to the data from the server.

User wants to add a todo? Represent that insert in the "outbox". User deletes a todo? Represent that operation in the outbox. Etc. etc.

Then do the operation (side effect) to send that to the server. 

If the server call succeeds, you can (again in order of preference):

1. Refresh the server "box" of data. It should contain your changes (and any others)
2. *Replace* the entity from the server is the "box" with the new version returned from the server (or, in the case of a delete, remove it).

This can be represented to the user either explicitly, or somewhat hidden. 

1. Explicitly: Give the user a representation on the screen of the "pending" operations that are in their outbox.
   1. This could be a "toast" notification saying "Saving your changes to Mow the Lawn"... and when the operation completes, it just shows up in their todo list.
2. Implicitly: Their Todo List immediately shows the *combination* of the server state, with the *outbox* state. 
   1. A new todo *immediately* shows up in their todo list, but if it originates from the outbox, the affordances for operations on it will be hidden or disabled.
   2. You may visually indicate that it is a pending operation.
   3. If there is an error from the API, that change can be removed from the outbox, and a notification can be provided.
      1. Note, in advanced scenarios, the user could be asked to fix a problem and retry - consider the Taylor Swift example above.

A *super advanced* version of this would be to persist those changes somewhere they can be reloaded later. I've used IndexDb for this kind of thing once or twice. 


### Keeping Reference Data Fresh

A big cause of failure of operations, as we've explored here, is based on that unscientific formula I presented above: `Concurrency * Rate of Change * Time = Chance of Failure`

If you pick your seat for the Taylor Swift show and wait 3 days before you buy your tickets, you probably aren't going to get them. 

We can't really control the level of concurrency (how many users are accessing the same data), or how often they are changing that data, but we can mess with "time" a bit. 

You are best off if the users, when they are "pulling the trigger" on an operation, have the most up to date data. Remember, a user could be looking at available tickets (or cars, or whatever) from *then*, when their last retrieved them. 

So, retrieve them more often. 

Some patterns:

- Retrieve reference data as often as you can. That HTTP response *should* have cache-control headers, and if the API folks are getting mad at you hitting their API too much, tell them to add an acceptable "stale" time to the cache control header. Your browser will honor this. 
  - Retrieve on route changes. When a user moves from one route to another, request the data for that route *again*. 
  - Retrieve data when the user activates that browser tab your application lives in (see [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API))
  - Refresh data on a *timer*. Reload the data every *x* milliseconds.

Of course, this can get tricky. References to this data may live in other state in your application. You may need to "cascade" these changes to other parts of your application, and even notify the user. "Hey, those tickets you had in your request? Those seats are no longer available. You should pick some other ones."

You can also have the server "notify" you when certain *slices* of data you are interested in are changed. Instead of the "polling" techniques above, you can implement patterns using [Server Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) or [Web Sockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) 

With the polling techniques (making repeated HTTP calls), you are going to have a possibility of a low "hit" ratio. If you are are polling every second to see if that Ford Bronco is still available, and if the price is the same, that might be a lot of requests that just return the same data.

> [!TIP] This is where that E-Tag Thing I mentioned Earlier Might Help
> You can do a *conditional get*, basically saying "send me the vehicle list, but only if it is a different version than the one I already have (indicated by the `E-Tag` header)"

By using Server Sent Events or Web Sockets, when the *server* has a change, it can *push* that change to your application. It's a "don't call us, we'll call you" setup.  For example, if a car is sold, a Server Sent Event could notify all users of your application that the "Ford Bronco Is Gone". And I'd imagine with the Taylor Swift example, you could just sit and watch as the seats are rapidly taken by others.

Speaking of Taylor Swift tickets, another pattern is to make an operation where you allow the users to "lock" some data for some period of time. As they build up the data for their operation to purchase tickets, you could send to the server an operation that says "Hey, I have a user about to buy tickets for these two seats". The server can prevent anyone else from purchasing those tickets until either the user that has them locked completes the operation, or perhaps a time limit expires. 