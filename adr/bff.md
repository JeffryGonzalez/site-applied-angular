# 100 Backend for Frontend (BFF)

We will prefer the BFF pattern for developing and delivering our application.

## Choosing Against: Universal API Gateway

The popularization of the "Single Page Application" model (SPA) over a decade
ago brought along with it some architectural ideas that were current at the time
that have proven to be less than ideal.

Large companies were enamored with the idea of a view of Service Oriented
Architecture (SOA) where the companies IT infrastructure would be provided by a
sort of "back plane" of generally reusable services, usually going by some name
like the "Universal API Gateway".

For Angular applications (and other services and apps), the idea was that they
would aggregate together various services culled from the "catalog" to create
novel uses of the services.

The stressors of this approach include:

- "Universal" doesn't work. At a even moderate scale, this means that your
  particular application is consuming API resources that are irrelevant to your
  concerns. You end up doing a lot of filtering, modifying, and digging into
  representations from APIs.
- "Universal" means that often your frontend team would have to become customers
  to APIs you don't own, and special endpoints would have to be created on those
  APIs to support your application, introducing _coupling_.
- Security was supposed to be implemented primarily using OAuth2 tokens, which
  meant security information was vomited across service boundaries. The presence
  of security tokens, even in the form of JWTs, in the browser, is a known
  issue. It is also easy to leak data (See
  [Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/))
  since "universal" meant a particular API might share information that is
  confidential internally, but when exposed externally should be elided or
  filtered out.
- Complexity Creep: The user-interface code is the worst place to try to
  implement and orchestrate many _application layer_ requirements, especially
  when working with disparate data sources asynchronously. In some SOA
  environments, it isn't uncommon to have to call _many_ services to get pieces
  of data you need to accomplish one side-effect. Race conditions and failures
  are common.

One reason for the initial popularity of this approach was _specialization_. The
"dream" was that you would have teams of developers (frontend) that could focus
exclusively on the domain of UI/UX, while other "backend" developers would
handle the complexities of the server-side. This largely fails because this
means that changes on the frontend require coordination with the backend team,
including (and perhaps most importantly) in terms of deployment.

In reality, the "loose coupling" that was aimed for between frontend and backend
teams never happened. Changes on either side are rarely orthogonal.

## Choice: Backend for Frontend

In recent years there has been a rush to regain what we had before the SPA era -
in the time of "Web Applications". This is seen in newer approaches in frontend
frameworks like Angular's Server-Side Rendering, React's Server Component Model,
and tools like Next.JS, and Nuxt, from Vercel.

These approaches are at least in part motivated by the factors above.

In the BFF pattern, a single team owns and delivers both the frontend (in our
case, and Angular application), and the web application (API) that primarily
supports and delivers that application.

Unlike the old SPA model, where the application would be compiled and delivered
from a static server (usually NGINX) at a separate origin from the requisite
APIs it uses, with a BFF there is a single deliverable.

### Backend - ASP.NET Core 8

We will use an ASP.NET Core 8 Minimal API project for the backend.

During production, the frontend will be served from the `wwwroot/browser`
directory.

It will use HTTPS to help us detect any issues we would have when moving from
HTTP to HTTPS.

#### Reverse Proxy (YARP)

We'll use the
[`Yarp.ReverseProxy`](https://www.nuget.org/packages/Yarp.ReverseProxy) package
for two purposes:

1. During development, it will be used to proxy to the Angular dev server (at
   http://localhost:4200).
2. We will also use it to proxy calls to other services, if needed.

The `appsettings.development.json` file to proxy to the Angular application:

```json
 "ReverseProxy": {
    "Routes": {
      "ng": {
        "ClusterId": "ng-serve",
        "Match": {
          "Path": "{**catchall}"
        }
      }
    },
    "Clusters": {
      "ng-serve": {
        "Destinations": {
          "ng-serve/dev": {
            "Address": "http://localhost:4200"
          }
        }
      }
    }
  }
```