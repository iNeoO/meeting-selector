---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'meeting-selector'
  text: 'Documentation for meeting-selector'
  tagline: a meeting selector in multi frameworks
  actions:
    - theme: brand
      text: vue-meeting-selector
      link: /vue-meeting-selector/installation
    - theme: brand
      text: react-meeting-selector
      link: /react-meeting-selector/installation
  image:
    src: /images/meeting.png
    alt: meeting-selector

features:
  - icon: 🎨
    title: Fully customizable rendering
    details: Render your own headers, time slots, and navigation buttons using slots (Vue) or render props (React). Integrate seamlessly with your design system.

  - icon: ✅
    title: Supports single and multiple selections
    details: Out of the box support for both single-slot and multi-slot selection modes. Typed and fully controlled.

  - icon: ⚙️
    title: Built-in pagination and loading
    details: Handle long lists of appointments with configurable pagination, loading states, and async-friendly hooks.

  - icon: 🌐
    title: Works with Vue & React
    details: Use the same core logic in Vue 3 or React, with consistent typing and feature parity across both frameworks.
---
