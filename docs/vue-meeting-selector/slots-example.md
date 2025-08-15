# Slots example

<ClientOnly>
  <SlotsExample />
</ClientOnly>

> 💡 **Accessing the component ref**  
> Since `<SlotsExample />` is a generic component, you need to install [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers) to access its ref with full type safety.
>
> Here's how you can do it:
>
> ::: code-group
>
> ```bash [npm]
> npm install vue-component-type-helpers
> ```
>
> ```bash [pnpm]
> pnpm add vue-component-type-helpers
> ```
>
> ```bash [yarn]
> yarn add vue-component-type-helpers
> ```
>
> :::
>
> ```ts
> import { useTemplateRef } from 'vue-component-type-helpers';
> import type { MeetingSelectorType } from '@/types/MeetingSelectorType';
>
> const meetingSelector = useTemplateRef<MeetingSelectorType>('meetingSelector');
> ```

::: code-group

<<< ../.vitepress/components/vue/SlotsExample.vue

:::

<script setup lang="ts"> import SlotsExample from '../.vitepress/components/vue/SlotsExample.vue' </script>
