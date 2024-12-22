# Services in Angular

> [!IMPORTANT] TLDR
> Angular services need *providers*. The most common way is to have Angular create a provider for your service by adding the service type to a `providers` array at the application level (`app.config.ts`), for a set of routes, or on the component's `providers` array. **Adding a provider for the service this way always results in a new instance of the service being created at the level indicated by that array.** If you provide the same service by adding it to multiple `providers` arrays, you will have multiple instances of that service in memory. **Adding the `{provideIn: 'root'}` has no impact on this behavior.

Services in Angular have to be *provided* by the Angular framework. You cannot just inject a service (either using the `inject()` function, or a constructor) if you haven't provided Angular with an `provider` for that service.

There are two main "vectors" to think about when providing services in Angular.

They are, in order of general importance:

1. Scope - Where in your application is that service available to be injected and used?
2. Lifetime - How long should an instance of a service be kept in memory in your Angular application?


## 1. Scope

a. Globally - Services  added to the `providers` array of the `app.config.ts` are available globally to any injection context in your application. 
b. Routes - A tree of routes: Services added to the `providers` array of a route (and/or a route with children).
c. Component - At the component level. Services added to a components `providers` array are available to that component, and any nested components inside that component, and any components that are placed in a `<router-outlet />` within that component.

## 2. Lifetime

Services provided globally in `app.config.ts` and in the providers for a route:
    - Are created when they are first injected. If they are never injected, they are never created.
    - Live for the life of the application. They are never removed from memory (until you close the application).

Services provided to a component live for the life of that component. When that component is destroyed (taken out of the DOM), the service instance is also destroyed.

> Note: You can control *when* a service is created by creating an instance for your provider, or using a factory. Refer to the Angular.dev documentation for details.


## Guidance

Services that should be truly singletons and global for your application should be provided in the `app.config.ts`. 

Services that are part of a feature that is loaded through routes should be provided in that features route file in the `providers:[]` array.

If a service should be taken out of memory at any time, it **must** be provided in a component's `providers:[]` array. 

**Any** services that are provided multiple times (e.g., providing it in `app.config.ts`, in a route's `providers:[]` and/or a component's `providers:[]`) will result in multiple instances of the service being created. Since services are meant for holding state, this is *probably* not what you want.

The `@Injectable()` decorator on services is largely  not needed, and it's use is suspect in most cases. 

- You do not need to use `@Injectable()` on a service for it to be provided.
- You do not need to use `@Injectable()` on a service to inject dependencies into that service  if you are using Angular's `inject()` function.
    - You *do* need to use `@Injectable()` on a service if you  are injecting the service from a constructor. I reccommend moving away from that pattern.
- You *do* need to use `@Injectable()` if you are going to have your services lifetime limited by being part of  a components `providers:[]`, and want to implement `OnDestroy` to do cleanup when that service is taken out of memory.

> [!WARNING] Finally
> As an application developer, there is no reason to  use the `@Injectable({providedIn: 'root'})`  pattern.  This was added for *library* developers that provide a library with lots of different services, and makes it so that unused services are not added to the bundle of the compiled application. With it,  you  do not need to  add the service to any  providers for it  to be injected, in essence getting the same end result  of putting the service in the `app.config.ts`'s `providers:[]` array. It will be global, and live as long as  your application. However, any subsequent additions of this service to *any* provider array will still create a separate instance of  that service at that level. A lot of time has been wasted by me and many  other developers tracking down service lifetimes, etc. By removing the option to use `providedIn: 'root'` in your code, that means you can simply look up  the hierarchy of `provider:[]`  arrays to find where the instances are being created. 

I recommend an ESLint rule to warn you (or give you an error) about this usage:

```javascript
"no-restricted-syntax": [
        "warn",
        {
          selector:
            "Decorator[expression.callee.name='Injectable'] > CallExpression[arguments.length=1] > ObjectExpression > Property[key.name='providedIn'][value.value='root']",
          message:
            "Are you sure you don't want to just create a provider for this?",
        },
      ],
```

This will give  you an eslint warning if you are using `@Injectable({providedIn: 'root'})`.




## Video Overview Of Service Registration

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1041525128?h=5d03c1b28e&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Angular Services"></iframe></div>