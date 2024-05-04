<script setup>
/* eslint-disable */
import { ref, defineProps } from 'vue';

const props = defineProps({
    dataToEdit: Object
});

console.log("===", props.dataToEdit);
</script>

<template>
    <div class="top-body-part centered-elements-container">
        <h1>Редактирование</h1>

    </div>
    <div>

        <p>Преподаватель:</p> 
        <select name = "teacher">
            <option selected>{{ `${dataToEdit.teacher_surname} ${dataToEdit.teacher_name}  ${dataToEdit.teacher_patronymic}`  }}</option>
            <option> lol lol lol </option>
        </select>
        
        <p>Группа:</p>
        <select name = "group">
            <option selected> {{ `${dataToEdit.group_name}` }}</option>
            <option> lol lol lol </option>
        </select>
        
        <p>Предмет:</p>
        <select name = "class_name">
            <option selected> {{ `${dataToEdit.class_name}` }}</option>
            <option> lol lol lol </option>
        </select>
        
        <p>Аудитория:</p>
        <select name = "room_num">
            <option selected> {{ `${dataToEdit.room_num}` }}</option>
            <option> lol lol lol </option>
        </select>

        <p>День недели:</p>
        <select name = "day_name">
            <option selected> {{ `${dataToEdit.day_name}` }}</option>
            <option> lol lol lol </option>
        </select>

        <p>Время:</p>
        <select name = "class_time">
            <option selected>{{ `${dataToEdit.class_start} - ${dataToEdit.class_end}` }}</option>
            <option> lol lol lol </option>
        </select>

    </div>

</template>

<style></style>