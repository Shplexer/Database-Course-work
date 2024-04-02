<script setup>
import { ref } from 'vue';
const daysOfTheWeek = ref([`Понедельник`, `Вторник`, `Среда`, `Четверг`, `Пятница`]);
const times = ref([`9:30`, `11:30`, `14:00`, `16:00`, `18:00`, `20:00`]);
const showOverlayCheck = ref(false);
const showLoginCheck = ref(false);
function showLogin() {
    changeOverlay();
    showLoginCheck.value = true;
}
function changeOverlay() {
    showOverlayCheck.value = !showOverlayCheck.value;
}
</script>

<template>

    <body>
        <div id="login-overlay" v-if="showLoginCheck && showOverlayCheck">
            <label>Username : </label>
            <input type="text" placeholder="Enter Username" name="username" required>
            <label>Password : </label>
            <input type="password" placeholder="Enter Password" name="password" required>
            <button type="submit">Login</button>
        </div>
        <div id="overlay" @click="changeOverlay" v-if="showOverlayCheck">
        </div>
        <div id="top-body">
            <div class="top-body-part centered-elements-container">
                <button>Выбор группы</button>
            </div>
            <div class="top-body-part centered-elements-container">
                <h1>Расписание</h1>
            </div>
            <div class="top-body-part">
                <button id='login-button' @click="showLogin">Вход</button>
                <div class='user-data'>
                    <p id='username'>shplex</p>
                    <p id='name'>Орехов Д.С.</p>
                    <p id='status'>Студент</p>
                </div>
            </div>
        </div>
        <div id="main-body">
            <table class="full-width-table" id="timetable">
                <tr>
                    <th> </th>
                    <th v-for="day in daysOfTheWeek" v-bind:key="day">
                        {{ day }}
                    </th>

                </tr>
                <tr v-for="time in times" v-bind:key="time">
                    <td>{{ time }}</td>
                    <td v-for="day in daysOfTheWeek" v-bind:key="day">

                    </td>
                </tr>

            </table>

        </div>
    </body>
</template>


<style>
body {
    background-color: #9FBBCC;
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
#login-overlay {
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
#login-overlay input {
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
}

#login-button {
    display: inline-block;
}

#main-body {
    background-color: #7A9CC6;
    top: 20px;
    bottom: 0px;
    left: 50px;
    right: 50px;
}

.full-width-table {
    width: 100%;
    table-layout: fixed;
}
</style>