import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Applied Angular",
  description: "Hypertheory Training",
  ignoreDeadLinks: true,
  head: [
    [ 'script', { src: 'https://player.vimeo.com/api/player.js'}]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Course", link: "/docs" },
      { text: "TDR", link: "/adr" },
      { text: "Guides", link: "/guides" },
    ],
    search: {
      provider: "local",
    },
editLink: {
      pattern: 'https://github.com/JeffryGonzalez/site-applied-angular/edit/main/:path'
    },
    sidebar: {
      "/docs/": [
        {
          text: "Docs",
          link: "/docs/",
          items: [
            { text: "Course Outline", link: "/docs/outline" },
            { text: "What's New", link: '/docs/new'},
  
            { text: "Why Angular", link: "/docs/applied" },
            { text: "Building Blocks", link: "/docs/building-blocks" },
            {
              text: "Components",
              link: "/docs/components/",
              items: [
                { text: "Signals", link: "/docs/components/component-state" },
                {
                  text: "Inputs",
                  link: "/docs/components/component-signal-inputs-outputs",
                },
                {
                  text: "Signal Service",
                  link: "/docs/components/signal-service",
                },
                { text: "Directives", link: "/docs/components/directives" },
              ],
            },
            { text: "State", link: "/docs/state" },
            { text: "Routing", link: "/docs/routing" },
            { text: "Legacy Angular", link: "/docs/legacy/" },
          ],
        },
      ],
      "/adr/": [
        {
          text: "TDR",
          items: [
            { text: "List", link: "/adr/" },
          
            { text: "Services", link: "/adr/services"},
            { text: "Singleton Service", link: "/adr/services/singleton"},
            { text: "Chunking", link: "/adr/chunking"},

            { text: "State Management", link: "/adr/state", items: [
                { text: "Overview", link: "/adr/state/state1", items: [
                    { text: "Component and Service", link: "/adr/state/1.component-state" },
                    { text: 'API Interaction Anti-Patterns', link: 'adr/state/3.api-interactions-anti-patterns'},
                    { text: "Outbox", link: "/adr/state/2.outbox" },
                ]},
            ]},
          
          ],
        },
      ],
      "/guides/": [
        {
          text: "Guides",
          items: [
           
           
            { text: "Ng Setup", link: "/guides/angular-setup" },
            { text: 'Template', link: '/guides/creating'},
            { text: "MSW", link: "/guides/msw" },
            { text: "Feature Flags", link: "/guides/feature-flags" },
            { text: "Component Inputs/ Outputs", link: "/guides/components"},
            { text: 'Directives', link: '/guides/directives'},
            { text: 'Zod for API Validation', link: '/guides/zod'},
            { text: 'Code Snippets', link: '/guides/snippets'}
          ],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/JeffryGonzalez/site-applied-angular" }],
  },
});
