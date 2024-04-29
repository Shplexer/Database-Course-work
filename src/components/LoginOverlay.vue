<script setup>
import { ref, defineEmits } from 'vue';

const username = ref('');
const password = ref('');
const isHidden = ref(true);
const showOverlayCheck = ref(true);
const emit = defineEmits(['showOverlay'])

async function validateLogin() {
    const loginResult = await Promise.resolve(window.Bridge.doSomething({ "req": "login", "username": username.value, "password": password.value }));
    isHidden.value = (loginResult.length > 0);
    if (isHidden.value) {
        console.log(JSON.stringify(loginResult) + loginResult);
        const userInfo = await Promise.resolve(window.Bridge.doSomething({ "req": "user", "login_id": loginResult[0].id }));
        showOverlayCheck.value = false;
        console.log(userInfo);
        emit('showOverlay', { "showOverlay": showOverlayCheck.value, "userInfo": userInfo });
    }
}
</script>

<template>
    <p class="errmessage" :class="{ hidden: isHidden }">Ошибка! Неправильно введен логин или пароль</p>
    <label>Username : </label>
    <input v-model="username" type="text" placeholder="Enter Username" name="username" required>
    <label>Password : </label>
    <input v-model="password" type="password" placeholder="Enter Password" name="password" required>
    <button @click="validateLogin" type="submit">Login</button>
</template>

<style></style>