import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Applied Angular",
  description: "Hypertheory Training",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Course", link: "/docs" },
      { text: "ADR", link: "/adr" },
      { text: "Guides", link: "/guides" },
    ],
    search: {
      provider: 'local'
    },

    sidebar: {
      '/docs/': [
        {
          text: 'Docs',
          items: [
            { text: 'Outline', link: '/docs/' },
            {
              text: 'Components', link: '/docs/components/', items: [
                { text: 'Signals', link: '/docs/components/component-state' },
                { text: 'Inputs', link: '/docs/components/component-signal-inputs-outputs' },
                { text: 'Signal Service', link: '/docs/components/signal-service' },
                { text: 'Directives', link: '/docs/components/directives' }
              ]
            },
            { text: 'Legacy Angular', link: '/docs/legacy/' },
            { text: 'State', link: '/docs/state'}
          ]
        },

      ],
      '/adr/': [
        {
          text: 'ADR',
          items: [
            { text: 'List', link: '/adr/' },
            { text: '100 BFF', link: '/adr/bff' },
            { text: '200 Components', link: '/adr/components' },
            { text: '400 Auth', link: '/adr/auth' },
          ]
        }
      ],
      '/guides/': [
        {
          text: 'Guides',
          items: [
            { text: 'List', link: '/guides/' },
            { text: 'BFF .NET', link: '/guides/bff-server' },
            { text: 'Ng Setup', link: '/guides/angular-setup' },
            { text: 'MSW', link: '/guides/msw' }
          ]
        }
      ]
    },
    socialLinks: [{ icon: "github", link: "https://www.hypertheory.com" }],
  },
});
