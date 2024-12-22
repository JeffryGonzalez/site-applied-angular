# Technical Discussion Records

See [About](./about.md) for information on Architectural Decision Records and Technical Discussion Records.



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


### Services and Service Registration

See [Services and Service Registration](./services/)