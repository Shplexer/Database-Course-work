<script setup>
import { ref, defineEmits, onMounted } from 'vue';

const showOverlayCheck = ref(true);
const emit = defineEmits(['showOverlay']);
const renderBtns = ref(false);
//const groups = ['423', '424', '425'];

async function groupIsChosen(group) {
    showOverlayCheck.value = false;

    emit('showOverlay', { "showOverlay": showOverlayCheck.value, "group": group });
}

const groups = ref([]);

onMounted(async () => {
    try {
        const allGroups = await window.Bridge.GET({ "req": "groups" });
        groups.value = allGroups;
    }
    finally {
        renderBtns.value = true;
    }

});
</script>

<template>
    <h1 style = "color: #2D2A2E;">Выберите группу</h1>
    <div class = "centered-elements-container" style="flex-direction: row;" v-if="renderBtns">
    <button v-for="group in groups" v-bind:key="group.id" @click="groupIsChosen(group)">
        {{ group.group_name }}
    </button>
    </div>
</template>

<style></style>