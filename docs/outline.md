
# Applied Angular Development 

This 4-day instructor led course is designed to help mid-level or senior Angular developers understand, identify, and implement patterns in Angular for applications that are written by a team of software developers, as well as learn the new capabilities in “modern” Angular, including standalone component architecture, signals, routing, and state management. 

Statistically speaking, new Angular applications usually have high velocity, but that trends downwards over time. This course will help level that line for consistent delivery of features your company needs. The Angular framework has evolved along with our experience in building durable, resilient applications. This course teaches developers how to write their best Angular apps. 

The course will culminate in an extensive mentored lab that will give the students the opportunity to apply the concepts from the classroom while working together, and as part of a team of developers contributing to the application. 

## Buzzwords Covered 

- State Management with Angular Signals 
- User State in an application 
- Angular Components and Angular Directives: How to Choose 
- Designing reusable component and directive libraries 
- RXJS and Observables 
- API Access Patterns including caching, validation, and Authentication / Authorization 
- Advanced Routing: Route Guards, Lazy Loading 
- Branch by Abstraction for Angular in a CI/CD environment with feature flags. 
- Additional technologies demonstrated: 
- Zod for data validation 
- Angular (Tanstack) Query for secure, efficient API access 
- NGRX Store / NGRX Signal Store 

## Prerequisites 

For this course, you are expected to have experience with Angular. You should know the general ontology of Angular - components, routing, services, etc. 
You should be comfortable with TypeScript and the Angular CLI. 
We will use Visual Studio Code as our development environment in this course. 
You should also have at least a beginner understanding of source code control with Git. 

## Objectives 

The objectives of this course are to help you create Angular applications that have some internal logic and resiliency. All code has churn - we make changes all the time. User-facing applications like we build with Angular tend to have a high rate of change _and_ they have to accommodate the changes on the backing services they use that may or may not be maintained by the same team. 

### Refactoring for Consistency 

We will start the course with an existing Angular application. We will explore the code base for code smells and weaknesses, including: 

### API Access 

- Hidden side effects (API Access, etc.) and inconsistent validation 
- Creating Services using the HttpClient 
- Using Http Interceptors 
- Duplicated API access and performance impacts 
- Managing API state with stores and signals. 

### Rendering and State 

- Rendering and other performance issues 
- Learn how change detection in Angular works 
- Default, OnPush, and Signals 
- Confusing or incorrect routing configuration 
- Routes as the primary state in your application 
- Ensuring data is available for each route 
- Misaligned security policies 
- Creating a route guard strategy  
- Learn the limits of route guards and how to protect your application 

### Component And UI / UX 

- Accessibility issues and inconsistent UI/UX 
- Using Directives and Components to enforce consistency 
- Introduction to Accessibility testing 

### Source Code Organization 

- Configuring for Branch by Abstraction 
- Learn how to safely update, extend, or replace portions of your application 
- Developing Features and Experiments 
- Using Feature Toggles 
- Sharing Code Between Features 
- Protecting shared code across features 
- Creating Angular libraries to share code across projects. 

### Centralizing Side Effects (API Calls, Etc.) 

- Using Angular HTTP Client and Angular Query to optimize data from APIs 
- Using the Backend-For-Frontend (BFF) 
- Strategies for accessing APIs your team doesn’t “own” 
- Validating data from APIs and handling errors 
- TypeScript only guarantees compile-time type checking 
- Learn when and how to validate data from external APIs 
- The use of a centralized "Store" for shared data in your application. 
- Data from APIs and data “owned” by the user of the application often needs to be accessed across components.  
- Discuss the importance of designing the “state” of your application and make it easy for new components to get (and mutate) the data they need. 
- Using RxJs to “normalize” the data from APIs for what your components need 
- Common RxJs Operators 
- Stream processing of Observables with RxJs 
- Using SwitchMap for “cancellable” operations 
- Using other RxJs operations to “hide” latency issues implicit in API calls 

### Rendering and State 

- Using Observables and Angular Signals to keep the UI in synch 
- Components rely on Angular Signals. Learn to transform observable RxJs streams into signals 
- Signals deep-dive 
- Understanding signals 
- Emitting new values for signals 
- Creating computed signals 
- Using signal side-effects 
- Sharing signals with child components 
- Input signals 
- Output signals 
- Components and Directives: Creating our Own Business Language with Angular 
- Learn the new control-flow idiom in Angular templates to simplify component rendering 
- @If, @For, @Else 
- Learn how to identify and generalize common UI patterns 

### Creating component hierarchies 

- Implement structural directives to centralize features across seemingly disparate components 
- Centralizing concerns for consistency with components and directives 
- Working with your team to create conventions in your application. 
- Angular is a tool for building cohesive, useful user interface and user experience. 
- Angular is also a tool for creating cohesive, useful  applications for prime developer experience. 

We will, throughout this course, learn how to identify “code smells” within an Angular application and apply refactorings to increase the legibility and ease of use for your developers. 

### [Supplemental: Moving “Legacy” Angular Applications Forward](./legacy/)

Much of Angular has changed and improved since the early days of its introduction in 2016 

We will explore the value of standalone components and how and why to transition from NgModules to standalone 

In 2016, Angular’s change detection seemed like magic. But magic has a price, and depending on the default change detection functionality in Angular will impact the performance of your application negatively. Learn how to detect change detection issues and move to modern Signals-based detection 

Angular source-level organization originally mirrored the “best practices” of the time – creating a form of Model-View-Controller separation of concerns pattern. Learn how to move to feature-based code organization to increase your team’s velocity in delivering new features for your application without breaking existing code. 

## Expected Outcome of this Training 

After completing this course, developers will have a good understanding of the affordances within Angular for building secure, performant, resilient, and evolving Angular applications. 

Just as importantly, developers will understand how to structure an Angular application that doesn't become more brittle and "bog down" as the application grows over time. 


 

 
