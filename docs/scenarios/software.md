# Issue Tracker

The instigating need was expressed as:

> We want an _app_ that allows our _users_ to submit _issues_ they are having with _software_.

Our _primary_ job is to figure out what they are trying to accomplish, but that usually is _not_ a safe thing to ask.

In order to do that, we have to do the following:

Figure out what they _mean_ by the italicized things above.

- Even with this, it is a bit obvious, but don't take their "names" at face value.

And then our job is to decide what those things mean to _us_. And they might have different names than this.

Then we use brains and code to iterate until we _actually_ know what we are doing.

> [!WARNING] Do not do a huge design sprint on things like this without writing code. You cannot write an app based on a design. Ever. It has never worked. At best you end up writing an app to a design that is wrong. I will not be taking questions. See "Waterfall". Our job is figuring out the type of thing we are building, and we can't do that without writing code. We use code to figure out the type of thing we are doing. Don't let some instructor or member of the consultant set bamboozle you. We used do a thing called creating a "prototype" (so "proto" meaning, "before", and "type" meaning categorizing, systemetizing, etc.) Actual old-school prototypes can be _amazingly_ valuable in some situations, the existence of something called a "prototype", means that there is going to be a, uh, I don't know, "currenttype", or "futuretype"? Google suggests maybe "neotype", which sounds cool and matrixy, and I kind of like it. Neo here meaning something like "the time period of recent to current". But we just call that software, I guess.

## App

We are going to build an Angular App. This is wrong to decide before we know what we are building, however, it would be a jerk move for me to decide that this should be something else, since it is an _Applied **Angular** class_

## Users

So, I asked this imaginary business person asking for this app what they meant by that, and they said "Our employees". The person logged on to the machine running the application. And "logged on" here means they have already supplied their credentials (username, password) to a system that is good at that stuff. In other words, we won't be logging people on or creating accounts and stuff. We will need to have some access to who their are, and they will have to be authenticated to use this app.

## "Issues", "Software", all that.

These words are used to describe in some way what they want to accomplish with this app as if it were obvious. Treat them a little suspect. They are rushing to a solution.

I always start with the "action" part, which is the "submitting" thing here. And they are submitting an issue.

So, an imagined back and forth. I will play the role of Sue, and Bob will be the BA or whoever we are talking to:

- Sue: So, these "issues", when you say "submit", who are they submitted to?
- Bob: I'm working with the Software Team, they own the software here. And they are going to create a REST API that you can POST these too.
- Sue: Awesome. Sounds important!. So, what are they going to do with these issues?
- Bob: Sounds like they are going to review them, to prioritize them and stuff. Right now it's just emails and phone calls all day long, and they want to cut down on the noise.

> [!INFO] Big hints here - One thing they are going for is "cutting down on the noise", filtering in some way. That's what "reviewing" means.

- Sue: Awesome! Any idea how they review them? To prioritize their work, I suppose. Any insight into that.
- Bob: Boy can those folks talk about that. The stories they tell. But yeah, generally it's something like:
  - If there is an issue that is causing us to have outages that impact our customers, it is _always_ high priority.
  - If there is an outage that is keeping the employee from doing their job, it is high priority, but it sort of depends on who the employee is, if you catch my drift. Like _anything_ with Carla (the CEO) is automatically high priority, but if it is Enrique (the CIO), it's high priority depending on the software. I guess he used to file issues about MineSweeper all the time (don't tell anyone that, it was told me to me in confidence).

> [!INFO] Don't get lost in this. We aren't writing the code to prioritize things, but we need to know what we need to collect so that they can. We sort of _obviously_ can't ask the user submitting the issue what priority it should be assigned.

- Sue: Ok, that sounds awesome. I have more questions about the "Issues", but let me pick your brain about this "Software" thing. What is "Software" to the Software Center folks?
- Bob: Like I said, talk to them, they are going to give you an API you can call. But, as you know, the company doesn't allow you to install just any old software you want, and if you are going to ask for support, that software has to be something we own so it can be routed to the owner of that software on the team, so they can handle it.
- Sue: Ok, so they can't just submit an issue for any old piece of software, it has to come from these folks. Got it. Know anything else that can help us get the ball rolling on this?
- Bob: It's actually pretty complicated, they showed me the Excel spreadsheet they are using until the intern finishes this super Python REST API. They categorize software by vendor, and then title, and then versions. But lately, we also support software on multiple operating systems, so sometimes a version of a piece of software is supported on one operating system, but not another.
- Sue: Glad that's not my job! So, how long does support last for these things? Any idea?
- Bob: It changes all the time. They add stuff, take it away. That's why they need this API the bosses kid is building. (oops, don't share that, either). Right now everybody just passes around read-only copies of this Excel spreadsheet.
- Sue: That API will sure make things better! But wait, what if a user submits an issue, and between the time they submit it and when it is, uh, resolved? fixed? cancelled? the software is removed from the supported list?
- Bob: I think that's a question for the Software team. I'm sure it is one of those "it depends" things. Good question, though.

> [!INFO] Again, I don't want to know their process and their "it depends" stuff. What I'm looking at here is the _stability_ of the data. Can our app's software be a simple reference to their software catalog, or does "Software" mean something else to us than it does to them? I'm suspecting it does. More on that after some more questions. Also, I'm slightly exaggerating this new "REST API" they are creating here, but I want to point out that we _must_ avoid any coupling with their system, or we cannot get busy on this until they have their stuff together.

- Sue: Mind if we go back to the "Issues" thing? So, we have this list of supported software we'll get from their API, and an Employee can pick from that list and give us the information we need to create this "Issue" that we will submit to the software team. How am I doing? Getting this right.
- Bob: Doing great, but one thing, and maybe you forgot about this, but not every employee has every piece "entitled" to them. For example, Brad up at the front desk can't submit an issue for Visual Studio, and I can't submit an issue about Kafka, I don't even know what that is!
- Sue: Oh, I _did_ forget about that! Thanks :roll_eyes:. So, will this (checks notes) Python REST API be able to tell us what software a user has "entitled" to them?
- Bob: _good question_. Let me check with them on that.
- Sue: And now that I think of it, is there ever a time where you can see an employee submitting an issue on behalf of another employee? Like, what if an employee has an issue where their internet doesn't work, can their manager submit an issue for them?
- Bob: Wow, we are really figuring this out, aren't we? I'm going to bring that up with the Software Team. Let's put a pin in that until I hear back from them, OK? I was going to ask them about that, anyway, so...
- Sue: Sure. Great. :roll_eyes:.
- Bob: Any other questions?
- Sue: Hmmm...
- Bob: So, yeah, I think it should be pretty straight forward, just a form they fill out and hit submit, with a text box to explain their issue, and dropdowns to pick their platform, vendor, application, and version. Shouldn't take too long, right?
- Sue: Yeah, something like that sounds great. Almost like it could just be an email template. But that makes me think, that sounds like after the employee sends the issue, we are kind of done here, right? Like, do we need to track these issues? What if a user figures out something else about that issue, or gets the thing working on their own? Do we need a way to cancel the issue? Make changes to it in some way? How will the user know if the issue has been resolved or not?
- Bob: Well, I think they were just going to periodically dump these into another spreadsheet (that intern is using a great "BIG DATA" library for Python that lets you write to Excel. Makes me start to wonder why we use .NET for everything!, anyhow...) and work from there, and they'll contact the employee when they get to them, but I see what you mean about the employee cancelling them or whatever.
- Sue: So, it sounds like "Issues" are a thing the Software Team has, and what we are creating is a way to get something on the issue list. That makes sense. Thanks.
- Bob: Glad I could help, sorry if I looked distracted there, I was chatting with the Software Center people again, they are going to have that kid actually write some code to call a REST API you will create that will let the employee know the status of the issue. I think that is really important. And maybe we can get a sort of back-and-forth between your two systems. Might be best if I just have him send you a link to the shared Excel file they are dumping this stuff into and you can work from that? Make a request from them for access.
- Sue: Uh, I'll look into it.
- Bob: Sounds good. Sounds like we are about done here.
- Sue: Actually, one more quick thing. Any idea what would be most helpful for the Software team to address these issues? Anything other than just a description of what is going wrong?
- Bob: What a team player! I mean, you should check with them, but yeah, good idea.
- Sue: Yeah, since the idea is to cut down on their load, I think there are some interesting things we could do here to help them.
- Bob: Ok, keep me posted. Thanks, Angela.
- Sue: It's Sue, but thank you Bob.
