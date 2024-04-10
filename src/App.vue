<script setup>

import { ref, watch } from 'vue';
import LoginOverlay from './components/LoginOverlay.vue';
import TimeTable from './components/TimeTable.vue';
import GroupChoiceOverlay from './components/GroupChoiceOverlay.vue';

const showOverlayCheck = ref(false);
const showLoginCheck = ref(false);
const showGroupsCheck = ref(false);
const chosenGroup = ref({ "group_name": "Выбор группы" });
const userInfo = ref([{ "surname": "", "name": "", "patronymic": "", "role": "" }]);
const timeTable = ref([{}]);
const currentWeek = ref("Четная неделя");

const render = ref(false);
watch(timeTable, () => {
    console.log("timeTable: " + JSON.stringify(timeTable.value));
    render.value = true;
});


function showLogin() {
    showOverlay();
    showLoginCheck.value = true;
}
function showGroups() {
    showOverlay();
    render.value = false;
    showGroupsCheck.value = true;
}
function showOverlay() {
    showOverlayCheck.value = true;
}
function closeAllOverlays() {
    showOverlayCheck.value = false;
    showGroupsCheck.value = false;
    showLoginCheck.value = false;
    render.value = true;
}


function swapWeek() {
    currentWeek.value = currentWeek.value === 'Четная неделя' ? 'Нечетная неделя' : 'Четная неделя';
}
</script>

<template>

    <body>
        <div id="login-overlay" class="overlay-window" v-if="showLoginCheck && showOverlayCheck">
            <LoginOverlay @showOverlay="(resp) => {
                showOverlayCheck = resp.showOverlay;
                showLoginCheck = resp.showOverlay;
                userInfo = resp.userInfo;
            }" />

        </div>
        <div id="group-overlay" class="overlay-window" v-if="showGroupsCheck && showOverlayCheck">
            <GroupChoiceOverlay @showOverlay="(resp) => {
                showOverlayCheck = resp.showOverlay;
                showGroupsCheck = resp.showOverlay;
                chosenGroup = resp.group;
                timeTable = resp.timeTable;

            }" />
        </div>
        <div id="overlay" @click="closeAllOverlays" v-if="showOverlayCheck">
        </div>
        <div id="top-body">
            <div class="top-body-part centered-elements-container">
                <button @click="showGroups">{{ chosenGroup.group_name }}</button>
            </div>
            <div class="top-body-part centered-elements-container">
                <h1>Расписание</h1>
                <button @click="swapWeek">{{ currentWeek }}</button>
            </div>
            <div class="top-body-part">
                <button id='login-button' @click="showLogin">Вход</button>
                <div class='user-data'>
                    <p id='name'>{{ userInfo[0].surname }} {{ userInfo[0].name }} {{ userInfo[0].patronymic }}</p>
                    <p id='status'>{{ userInfo[0].role }}</p>
                </div>
            </div>
        </div>
        <div id="main-body">
            <TimeTable :timeTableData="timeTable" v-if="render" />

        </div>
    </body>
</template>


<style>
body {
    background-color: #2D2A2E;
    color: #FFFAE2;
}

label,
.errmessage {
    color: rgba(16, 37, 49, 0.5);
}

table,
th,
td {
    border: 1px solid black;
    border-collapse: collapse;
}


#overlay {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: rgba(16, 37, 49, 0.5);
}

.overlay-window {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    z-index: 100;
    padding: 25px;
}

.overlay-window input {
    width: 100%;
    margin: 8px 0;
    padding: 12px 20px;
    display: inline-block;
    border: 2px solid;
    box-sizing: border-box;
}

.hidden {
    display: none;
}

.shown {
    display: block;
}

#top-body {
    display: flex;
}

.top-body-part {
    flex: 1;
    text-align: center;
}

.centered-elements-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

#login-button {
    display: inline-block;
}

#main-body {
    top: 20px;
    bottom: 0px;
    left: 50px;
    right: 50px;
}

.full-width-table {
    width: 100%;
    table-layout: fixed;
}

#timetable td {
    height: 100px;
}
</style>./bridge.js