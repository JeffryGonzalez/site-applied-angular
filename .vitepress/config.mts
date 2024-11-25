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
      { text: "Pre-Work", link: "/docs/pre-work"},
      { text: "Course", link: "/docs" },
      { text: "ADR", link: "/adr" },
      { text: "Guides", link: "/guides" },
    ],
    search: {
      provider: "local",
    },

    sidebar: {
      "/docs/": [
      
        {
          text: "Docs",
          link: "/docs/",
          items: [
            { text: "Outline", link: "/docs/outline" },
            { text: "Pre-Work", link: "/docs/pre-work", 

              items: [
                { text: 'Overview', link: '/docs/pre-work'},
                { text: 'Create Project', link:'/docs/pre-work/01-project'},
                { text: 'Components w/Inputs', link: '/docs/pre-work/02-components-inputs'},
                { text: 'Components w/Outputs', link: '/docs/pre-work/03-components-outputs'},
              ]
            },
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
            { text: "Scenarios", link: "/docs/scenarios/software" },
          ],
        },
      ],
      "/adr/": [
        {
          text: "ADR",
          items: [
            { text: "List", link: "/adr/" },
            { text: "100 BFF", link: "/adr/bff" },
            { text: "200 Components", link: "/adr/components" },
            { text: "400 Auth", link: "/adr/auth" },
          ],
        },
      ],
      "/guides/": [
        {
          text: "Guides",
          items: [
            { text: "List", link: "/guides/" },
            { text: "BFF .NET", link: "/guides/bff-server" },
            { text: "Ng Setup", link: "/guides/angular-setup" },
            { text: "MSW", link: "/guides/msw" },
            { text: "Feature Flags", link: "/guides/feature-flags" },
          ],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: "https://www.hypertheory.com" }],
  },
});
