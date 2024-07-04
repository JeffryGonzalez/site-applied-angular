# The Angular Application

The Angular application was created with the Angular CLI. I skipped tests, and
set the configuration to use inline styles and templates by default (as per
[ADR - Components](../adr/components.md)).

The command was this:

```shell
ng new Frontend --skip-tests --skip-git -t -s
```

![NgNew](/media/ngnew.gif)
::: info Testing
We are skipping tests for this course - that will be a topic for a future course. However, 
we will be more intentional about our testing plan than using the default configuration (Karma, etc.)
provided by the Angular CLI
:::


## BFF Specific

In the `src/app` directory are two files:

### `getCookie.ts`

This is a utility function used to load the `XSRF-RequestToken` cookie set by
the server. This is a technique used to impede Cross-Site Request Forgery
vulnerabilities.

### `secure-api.interceptor.ts`

This is an HTTP Interceptor (we add in the `app.config`) to send that XSRF
cookie back to the server in a header to be verified by the server.

### `app.config.ts`

We provide the HttpClient, and add the interceptor above. We also add a Content
Security Policy _Nonce_ that is provided by the server in the `index.html` when
served from the API. This is to help impede replay attacks. You can read more
here
[https://content-security-policy.com/nonce/](https://content-security-policy.com/nonce/)

## Mock Service Workers

See [MSW](../guides/msw)

## Tailwind and DaisyUI

We initialized our Angular application with TailwindCSS. Following the
instructions here:
[Tailwind and Angular](https://tailwindcss.com/docs/guides/angular).

Using the Tailwind CSS Extension, add the following to your VSCode settings:

![Tailwind](/media/tw.gif)
```json
{
  "files.associations": {
    "*.css": "tailwindcss" // [!code ++]
  },
  "editor.quickSuggestions": {
    "strings": "on" // [!code ++]
  }
}
```

### Add Some Tailwind Plugins:

```shell
npm i -D @tailwindcss/typography @tailwindcss/forms @tailwindcss/aspect-ratio @tailwindcss/container-queries daisyui
```

And add them to your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"), // [!code ++]
    require("@tailwindcss/forms"), // [!code ++]
    require("@tailwindcss/aspect-ratio"), // [!code ++]
    require("daisyui"), // [!code ++]
  ],
};
```