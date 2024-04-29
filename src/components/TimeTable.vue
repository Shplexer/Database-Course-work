<script setup>
import { ref, defineProps } from 'vue';

const times = ref([`9:30`, `11:30`, `14:00`, `16:00`, `18:00`, `20:00`]);
const daysOfTheWeek = ref([`Понедельник`, `Вторник`, `Среда`, `Четверг`, `Пятница`]);
const props = defineProps({
    timetableData: Array
});
console.log("@@@", props.ttData);

const setClass = (timeIndex, dayIndex) => {

    return props.timetableData.find(
        data => parseInt(data.class_num) === timeIndex + 1 && parseInt(data.day) === dayIndex + 1
    );
};

</script>
<template>
    <table class="full-width-table" id="timetable">
        <!-- Header row with days of the week -->
        <thead>
            <tr>
                <th></th>
                <th v-for="day in daysOfTheWeek" :key="day">{{ day }}</th>
            </tr>
        </thead>
        <tbody>
            <!-- Rows for each time slot -->
            <tr v-for="(time, timeIndex) in times" :key="time">
                <!-- First column with time -->
                <td>{{ time }}</td>
                <!-- Data cells -->
                <td v-for="(day, dayIndex) in daysOfTheWeek" :key="day">
                    <!-- Find the data item with matching time and day -->
                    <span v-if="setClass(timeIndex, dayIndex)">
                        <p class="class-name">
                            {{ setClass(timeIndex, dayIndex).class_name }}
                            {{ `(${setClass(timeIndex, dayIndex).class_type})` }}
                        </p>
                        <p class="teacher-data">
                            {{ setClass(timeIndex, dayIndex).teacher_surname }}
                            {{ setClass(timeIndex, dayIndex).teacher_name.charAt(0) + '.' }}
                            {{ setClass(timeIndex, dayIndex).teacher_patronymic.charAt(0) + '.' }}
                        </p>
                        <p class="room-data">
                            {{ setClass(timeIndex, dayIndex).room_num + ' ауд.' }}
                        </p>
                        <a class="address-data" :href="setClass(timeIndex, dayIndex).address_URL">
                            {{ setClass(timeIndex, dayIndex).address }}
                        </a>

                    </span>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style></style>