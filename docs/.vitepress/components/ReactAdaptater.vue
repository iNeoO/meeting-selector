<template>
  <div ref="el" />
</template>

<script setup>
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ref, onMounted } from 'vue';

const props = defineProps({
  component: {
    required: true,
  },
});

const el = ref(null);
onMounted(() => {
  const root = createRoot(el.value);
  root.render(createElement(props.component, {}, null));
});
</script>
