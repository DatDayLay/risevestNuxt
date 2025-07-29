<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <div v-if="props.isVisible" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-scroll lg:overflow-hidden bg-black/50">
    <div class="bg-white rounded-xl w-[95%] max-w-lg lg:w-full py-4 sm:py-6 lg:py-8 relative mx-auto">
      <!-- <button v-if="props.isVisible" @click="closeModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none">
        &times;
      </button> -->
      <slot></slot>
    </div>
  </div>
</template>