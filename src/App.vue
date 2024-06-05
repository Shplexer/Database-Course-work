<script setup>
import { ref, watch, onMounted } from 'vue';
import LoginOverlay from './components/LoginOverlay.vue';
import TimeTable from './components/TimeTable.vue';
import GroupChoiceOverlay from './components/GroupChoiceOverlay.vue';
import EditOverlay from './components/EditOverlay.vue';


const showOverlayCheck = ref(false);
const showLoginCheck = ref(false);
const showGroupsCheck = ref(false);
const showEditCheck = ref(false);
const showConnectionCheck = ref(false);
const readyToLoadTT = ref(false);
const refresh = ref(0);

const chosenGroup = ref({ "group_name": "Выбор группы" });
const userInfo = ref([{ "surname": "", "name": "", "patronymic": "", "role": "Гость" }]);

const currentWeek = ref("Четная неделя");
const weekID = ref(1);

const timetableData = ref([]);
const dataToEdit = ref({});
const dataToEditTime = ref(0);
const dataToEditDay = ref(0);

onMounted(async () => {
 await checkConnection();
 document.title = 'Schedule';
});
async function checkConnection() {
    let dbCon;
    try {
        dbCon = await window.Bridge.openDBConnection();
        
    }
    finally {
        console.log(dbCon);
        showConnectionCheck.value = !dbCon;
    }
}
function showLogin() {
    showOverlay();
    showLoginCheck.value = true;
}
function showGroups() {
    showOverlay();
    showGroupsCheck.value = true;
}

function showOverlay() {
    showOverlayCheck.value = true;
}
function closeAllOverlays() {
    showOverlayCheck.value = false;
    showGroupsCheck.value = false;
    showLoginCheck.value = false;
    showEditCheck.value = false;
}

async function fetchTimetable(groupId) {
    let response;
    try {
        if (groupId) {
            response = await window.Bridge.GET({ req: 'timetable', group: groupId, week: weekID.value });
        }
    }
    finally {
        timetableData.value = response; // Set the resolved data to reactive property
        console.log(timetableData.value);
        readyToLoadTT.value = true;
    }
}
watch([chosenGroup, weekID, refresh], async () => {
    try {
        readyToLoadTT.value = false;
        if (chosenGroup.value.group_name !== "Выбор группы") {
            await fetchTimetable(chosenGroup.value.id);
        }
    }
    finally {
        console.log("changed2", timetableData.value);
    }
});
function swapWeek() {
    currentWeek.value = currentWeek.value === 'Четная неделя' ? 'Нечетная неделя' : 'Четная неделя';
    weekID.value = weekID.value === 1 ? 2 : 1;
}
</script>

<template>

    <body>
        <div id = "connection-overlay" class="overlay-window centered-elements-container" v-if="showConnectionCheck">
            <h1>Не удалось подключиться к базе данных</h1>
            <button @click="checkConnection">Попробовать снова</button>
        </div>
        <div id = "unclickable-overlay" v-if="showConnectionCheck"> 

        </div>

        <div id = "edit-overlay" class="overlay-window" v-if="showEditCheck && showOverlayCheck">
            <EditOverlay :dataToEdit="dataToEdit"
             :dataToEditTime ="dataToEditTime" 
             :dataToEditDay ="dataToEditDay" 
             :dataToEditWeek = "weekID" 
             :dataToEditGroup = "chosenGroup.id" 
             :userRole = "userInfo[0].role" 
             @showOverlay="
                closeAllOverlays();
                refresh++;
                " />
        </div>
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
                    <p id='role'>{{ userInfo[0].role }}</p>
                </div>
            </div>
        </div>
        <div id="main-body">
            <TimeTable :timetableData="timetableData" :currentUser="userInfo[0]" v-if="readyToLoadTT" @showOverlay ="(resp) => {
                dataToEdit = resp.dataToEdit;
                dataToEditTime = resp.dataToEditTime;
                dataToEditDay = resp.dataToEditDay;
                showEditCheck = true;
                showOverlayCheck = true;
            }"/>

        </div>
    </body>
</template>


<style>

#connection-overlay h1 {
    color: #2D2A2E;
}
button{
    margin: 5px;
}
body {
    background-color: #2D2A2E;
    color: #FFFAE2;
}
#edit-overlay h1, #edit-overlay p{
    color: rgb(16, 37, 49);
}

label{
    color: rgb(16, 37, 49);
}
.errmessage {
    color: rgb(255, 0, 0);
}

table,
th,
td {
    border: 2px solid black;
    border-collapse: collapse;
}

#unclickable-overlay {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: rgba(16, 37, 49, 0.5);
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
</style>