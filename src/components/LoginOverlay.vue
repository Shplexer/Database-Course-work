<script setup>
import { ref, defineEmits } from 'vue';

const username = ref('');
const password = ref('');
const isHidden = ref(true);
const showOverlayCheck = ref(true);
const emit = defineEmits(['showOverlay'])

async function validateLogin() {
  let loginResponse;
  try {

    loginResponse = await window.Bridge.GET({
      req: 'login',
      username: username.value,
      password: password.value
    });
  }
  finally {


    isHidden.value = loginResponse.length > 0;

    if (isHidden.value) {
      const userId = loginResponse[0].id;
      const userInfoResponse = await window.Bridge.GET({ req: 'user', login_id: userId });

      showOverlayCheck.value = false;
      emit('showOverlay', {
        showOverlay: showOverlayCheck.value,
        userInfo: userInfoResponse
      });
    }
  }
}
</script>

<template>
  <p class="errmessage" :class="{ hidden: isHidden }">Ошибка! Неправильно введен логин или пароль</p>
  <label>Имя пользователя : </label>
  <input v-model="username" type="text" placeholder="Enter Username" name="username" required>
  <label>Пароль : </label>
  <input v-model="password" type="password" placeholder="Enter Password" name="password" required>
  <button @click="validateLogin" type="submit">Вход</button>
</template>

<style></style>