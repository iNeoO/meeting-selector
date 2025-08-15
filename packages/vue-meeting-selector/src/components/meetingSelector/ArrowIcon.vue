<template>
  <i role="img" class="meeting-selector__icon" :class="iconDirectionClass" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  direction: 'up' | 'down' | 'left' | 'right';
}>();

const iconDirectionClass = computed(() => `meeting-selector__icon-${props.direction}`);
</script>
