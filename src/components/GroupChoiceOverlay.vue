<script setup>
import { ref, defineEmits, onMounted } from 'vue';

const showOverlayCheck = ref(true);
const emit = defineEmits(['showOverlay']);

//const groups = ['423', '424', '425'];

async function groupIsChosen(group){
    showOverlayCheck.value = false;
    group.group_name += " группа"
    const timetable = await fetchTimetable(group.id);
    console.log(timetable);
    emit('showOverlay', {"showOverlay": showOverlayCheck.value, "group": group, "timeTable": timetable});
}

async function fetchTimetable(groupId) {
  const response = await window.Bridge.doSomething({ req: 'timetable', group: groupId });
  return response;
}
const groups = ref([]);
onMounted(async () => {
      const allGroups = await Promise.resolve(window.Bridge.doSomething({"req":"groups"}));
      groups.value = allGroups;
    });
</script>

<template>
    <button v-for="group in groups" v-bind:key="group.id" @click="groupIsChosen(group)">
        {{ group.group_name }}
    </button>
</template>

<style></style>