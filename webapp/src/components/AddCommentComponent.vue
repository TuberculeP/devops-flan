<script setup lang="ts">
import { defineEmits, ref } from "vue";
const emit = defineEmits<{
  (e: "commentAdded", comment: string): void;
}>();

const comment = ref("");

const addComment = () => {
  if (comment.value.trim()) {
    emit("commentAdded", comment.value);
    comment.value = ""; // Clear the input after emitting
  }
};
</script>
<template>
  <div>
    <textarea
      v-model="comment"
      placeholder="Écrivez votre commentaire ici..."
    ></textarea>
    <button @click="addComment">Ajouter</button>
  </div>
</template>
