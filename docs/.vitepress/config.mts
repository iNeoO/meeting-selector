import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'meeting-selector',
  description: 'Documentation for meeting-selector',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'vue-meeting-selector',
        link: '/vue-meeting-selector/installation',
      },
      {
        text: 'react-meeting-selector',
        link: '/react-meeting-selector/installation',
      },
    ],

    sidebar: [
      {
        text: 'Introduction',
        link: '/introduction',
      },
      {
        text: 'Common',
        items: [
          {
            text: 'Generate meetings by days',
            link: '/common-meeting-selector/generate-meetings-by-days',
          },
          {
            text: 'Generate placeholder',
            link: '/common-meeting-selector/generate-placeholder',
          },
        ],
      },
      {
        text: 'react-meeting-selector',
        items: [
          {
            text: 'Getting Started',
            items: [
              {
                text: 'Installation',
                link: '/react-meeting-selector/installation',
              },
              {
                text: "What's new",
                link: '/react-meeting-selector/whats-new',
              },
            ],
          },
          {
            text: 'Documentation',
            items: [
              {
                text: 'Props',
                link: '/react-meeting-selector/props',
              },
            ],
          },
          {
            text: 'Examples',
            items: [
              {
                text: 'Simple example',
                link: '/react-meeting-selector/simple-example',
              },
              {
                text: 'Simple async Example',
                link: '/react-meeting-selector/simple-async-example',
              },
              {
                text: 'Multi example',
                link: '/react-meeting-selector/multi-example',
              },
              {
                text: 'Multiple renders elements example',
                link: '/react-meeting-selector/multiple-renders-elements-example',
              },
            ],
          },
        ],
      },
      {
        text: 'vue-meeting-selector',
        items: [
          {
            text: 'Getting Started',
            items: [
              {
                text: 'Installation',
                link: '/vue-meeting-selector/installation',
              },
              {
                text: "What's new",
                link: '/vue-meeting-selector/whats-new',
              },
            ],
          },
          {
            text: 'Documentation',
            items: [
              {
                text: 'Props',
                link: '/vue-meeting-selector/props',
              },
              {
                text: 'Events',
                link: '/vue-meeting-selector/events',
              },
              {
                text: 'Slots',
                link: '/vue-meeting-selector/slots',
              },
            ],
          },
          {
            text: 'Examples',
            items: [
              {
                text: 'Simple example',
                link: '/vue-meeting-selector/simple-example',
              },
              {
                text: 'Simple async Example',
                link: '/vue-meeting-selector/simple-async-example',
              },
              {
                text: 'Multi example',
                link: '/vue-meeting-selector/multi-example',
              },
              {
                text: 'Slots example',
                link: '/vue-meeting-selector/slots-example',
              },
            ],
          },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/ineoo/meeting-selector' }],
  },
});
