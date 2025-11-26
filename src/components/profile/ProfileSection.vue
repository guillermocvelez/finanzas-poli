<template>
  <section class="profile-section">
    <h2 class="section-title">{{ title }}</h2>
    <div class="form-fields">
      <slot></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string;
}

defineProps<Props>();
</script>

<style scoped>
.profile-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--ion-text-color);
  margin: 0;
  letter-spacing: -0.5px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
