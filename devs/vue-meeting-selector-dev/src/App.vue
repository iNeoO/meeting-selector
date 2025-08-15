<template>
  <div id="meeting-selector-dev">
    <h1>Simple example</h1>
    <SimpleExample />
    <h1>Simple async example</h1>
    <SimpleAsyncExample />
    <h1>Multi example</h1>
    <MultiExample />
    <h1>Slots example</h1>
    <SlotsExample />
  </div>
</template>

<script setup lang="ts">
import SimpleExample from './components/SimpleExample.vue';
import SimpleAsyncExample from './components/SimpleAsyncExample.vue';
import SlotsExample from './components/SlotsExample.vue';
import MultiExample from './components/MultiExample.vue';
</script>
