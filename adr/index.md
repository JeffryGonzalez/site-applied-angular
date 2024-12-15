# Technical Discussion Records

Based on Architectural Decision Records (ADRs) See
[https://adr.github.io/](https://adr.github.io/), Technical Discussion Records
 are a common technique for a
team to share the decisions made on the architecture and technical
implementation of an application, especially when there are multiple _choices_
that could be made for a certain approach.

The goal here is to make that decision making "public" amongst the team, and
documented in the source repository of the application. If there are changes to
the thinking about any specific approach, the ADR for that decision should be
updated appropriately, and agreed upon by whatever review process the team is
comfortable with.

The approach in this application is to use "lightweight" ADRs.

In the title of the decisions, the terms _prefer_ or _consider_ are guidance. They should be accepted as your default approach within your application, though reasoned exceptions are permissable.

The terms _use_ or _must_ mean that these are currently considered invariants. If you discover a situation where you must vary from these points of guidance, you must first ammend the ADR for this decision and get it accepted.

## Components

### Standalone Components

Components must be _standalone_. No longer build Angular applications using the `NgModule` style. For more information see [Use Standalone Components](./components/standalone)

### Inline Styles and Templates

Prefer using inline-styles and templates. See [Prefer Inline Templates and Inline Styles](./components/inline)

### Use Signal-Based State

No state in a component should be "raw" variables that need to be tracked by Angular's Zone-based change detection. Use Signals, or, if not possible (yet) Observables can be used. [See Use Signal Based State](./components/signals)

### Prefer Logic-Free Components

Components statistically have the most "churn" in Angular apps. In order to facilitate this, [Prefer Logic Free Components](./components/logic-free)

## Project Structure

Prefer to organize your application's source code around business-facing features as opposed to technical concerns.

Since Angular applications are a tool to manipulate (and provide) the Document Object Model, the DOM is a hierarchy, and our Angular components mirror that hierarchy.

The root of almost all Angular applications is the `app-root` (the `ApplicationComponent`). We will call this the "Application".
