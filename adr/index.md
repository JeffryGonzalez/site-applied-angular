# Architectural Decision Records

Architectural Decision Records (ADRs) See
[https://adr.github.io/](https://adr.github.io/) are a common technique for a
team to share the decisions made on the architecture and technical
implementation of an application, especially when there are multiple _choices_
that could be made for a certain approach.

The goal here is to make that decision making "public" amongst the team, and
documented in the source repository of the application. If there are changes to
the thinking about any specific approach, the ADR for that decision should be
updated appropriately, and agreed upon by whatever review process the team is
comfortable with.

The approach in this application is to use "lightweight" ADRs.

## [100 Backend for Frontend (BFF)](./bff.md)

In this application we will implement our app with a BFF pattern.

## [200 Components](./components.md)

Components will be standalone, and we will prefer inline templates and styles.

## [400 Authn and Authz](./auth.md)

We will use OIDC and Oauth2 for authentication.