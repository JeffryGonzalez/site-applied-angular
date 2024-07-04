# 400 Authentication and Authorization

Our application will assume all users are already authenticated against and
OIDC/Oauth2 identity provider. If they are not authenticated, they will be asked
to authenticate.

**No unauthenticated access to the application will be allowed**.

We believe that handling things like passwords and identity should be left to
the pros. We will conform to the OIDC/Oauth2 protocols for this.

We will be _generally_ following the guidance here:
[(YouTube) Securing SPAs..BFF](https://www.youtube.com/watch?v=hWJuX-8Ur2k)

## No Tokens in the Browser

Since we are doing a [BFF](./bff.md), we will not allow any tokens to be sent to
the browser. We will use, on the client side, cookie authentication (with same
site constraints).

## Development Experience - Frontend

For development, we will use a mock OIDC / Oauth2 server.

## Development Experience - Backend

We will use tests where we stub the authentication.

We will use [Mock Oauth2 Server](https://github.com/navikt/mock-oauth2-server)