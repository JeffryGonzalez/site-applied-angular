# Backend for Frontend with .NET

The BFF pattern is both for developer convenience, and to improve security of
our application.

## Removing Server Headers

By default, ASP.NET Core's server, Kestrel, adds a header to the response
identifying the server as Kestrel. While this is perhaps helpful for getting
statistical information about the server for Microsoft marketing, it is sharing
too much detail with would-be-attackers. In the `Program.cs` file, I reccommend
removing the header.

```csharp
builder.WebHost.ConfigureKestrel(options =>
{
    options.AddServerHeader = false;
});
```

## Frontend Developer Experience

Angular developers are used to the `ng serve` experience where code changes are
automatically _pushed_ to the UI upon recompile.

While in production, our Angular application will be statically compiled and
served from the `wwwroot` directory, during development (e.g.
`ASPNETCORE_ENVIRONMENT=Development`) we will use the Yarp reverse proxy so that
when we hit the server's exposed URL (`https://localhost:7020`), it will proxy
unhandled requests (e.g., our Angular app) to `https://localhost:4200`.

A sample configuration (see the actual source code in the backend
`appsettings.development.json` for reference:)

```json
 "ReverseProxy": {
    "Routes": {
      "assets": {
        "ClusterId": "cluster1",
        "Match": {
          "Path": "assets/{**catch-all}"
        }
      },
      "vitefs": {
        "ClusterId": "cluster1",
        "Match": {
          "Path": "@fs/{**catch-all}"
        }
      },
      "vite": {
        "ClusterId": "cluster1",
        "Match": {
          "Path": "@vite/{**catch-all}"
        }
      },

      "routealljs": {
        "ClusterId": "cluster1",
        "Match": {
          "Path": "{nomatterwhat}.js"
        }
      },
      "routeallcss": {
        "ClusterId": "cluster1",
        "Match": {
          "Path": "{nomatterwhat}.css"
        }
      },
      "webpacklazyloadingsources": {
        "ClusterId": "cluster1",
        "Match": {
          "Path": "/src_{nomatterwhat}_ts.js"
        }
      },

      "webpacknodesrcmap": {
        "ClusterId": "cluster1",
        "Match": {
          "Path": "/{nomatterwhat}.js.map"
        }
      }
    },
    "Clusters": {
      "cluster1": {
        "HttpClient": {
          "SslProtocols": [
            "Tls12"
          ]
        },
        "Destinations": {
          "cluster1/destination1": {
            "Address": "https://localhost:4200/"
          }
        }
      }
    }
```

We load this in our `Program.cs`:

```csharp
builder.Services
    .AddReverseProxy()
    .LoadFromConfig(
        builder.Configuration.GetSection("ReverseProxy")
    );
```

And `Use` It after the application is built, but only in development, and only
when there is a configured `UiDevServerUrl`:

```csharp
if (app.Environment.IsDevelopment())
{
    var uiDevServer = app.Configuration.GetValue<string>("UiDevServerUrl");
    if (!string.IsNullOrEmpty(uiDevServer))
    {
        app.MapReverseProxy();
    }
}
```