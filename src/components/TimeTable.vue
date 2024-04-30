<script setup>
import { ref, defineProps } from 'vue';
import EditOverlay from './EditOverlay.vue';
//Поменять получением из бд (?)
const times = ref([`9:30`, `11:30`, `14:00`, `16:00`, `18:00`, `20:00`]);

const daysOfTheWeek = ref([`Понедельник`, `Вторник`, `Среда`, `Четверг`, `Пятница`]);
const showEditCheck = ref(false);

const props = defineProps({
    timetableData: Array,
    currentUser: Object
});


console.log("@@@", props.timetableData);
console.log("@@@@", props.currentUser);

const setClass = (timeIndex, dayIndex) => {
    return props.timetableData.find(
        data => parseInt(data.class_num) === timeIndex + 1 && parseInt(data.day) === dayIndex + 1
    );
};

const logParagraphs = (timeIndex, dayIndex) => {
    const classInfo = setClass(timeIndex, dayIndex);
    console.log('logParagraphs called', classInfo);
    // TODO: Вывод оверлея редактирования, с передачей ему classInfo
    // если classInfo не пустой, в оверлей редактирования передается название редактирования
    // иначе, передается название добавления
};

function canBeEditable(timeIndex, dayIndex) {
    const currentUserRole = props.currentUser.role_id;
    const classInfo = setClass(timeIndex, dayIndex);

    switch (currentUserRole) {
        case 1:
            console.log('Applying editing class to all tds for role_id 1');
            return true;
        case 2:
            console.log('Checking if teacher_id matches the currentUser id');
            return classInfo && classInfo.teacher_id === props.currentUser.role_id;
        case 3:
            console.log('Not applying editing class for role_id 3');
            return false;
        default:
            console.log('No matching role found. Not applying editing class');
            return false;
    }
}

</script>
<template>
    <div id="edit-overlay" class="overlay-window" v-if="showEditCheck && showOverlayCheck">
        <EditOverlay @showOverlay="(resp) => {                                      
        }" />

    </div>
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
                <td v-for="(day, dayIndex) in daysOfTheWeek" :key="day"
                    :class="{ 'editing-class-cell': canBeEditable(timeIndex, dayIndex) }"
                    @click.capture="canBeEditable(timeIndex, dayIndex) && logParagraphs(timeIndex, dayIndex)">
                    <!-- Find the data item with matching time and day -->
                    <span v-if="setClass(timeIndex, dayIndex)">
                        <p @click.stop class="class-name">
                            {{ setClass(timeIndex, dayIndex).class_name }}
                            {{ `(${setClass(timeIndex, dayIndex).class_type})` }}
                        </p>
                        <p @click.stop class="teacher-data">
                            {{ setClass(timeIndex, dayIndex).teacher_surname }}
                            {{ setClass(timeIndex, dayIndex).teacher_name.charAt(0) + '.' }}
                            {{ setClass(timeIndex, dayIndex).teacher_patronymic.charAt(0) + '.' }}
                        </p>
                        <p @click.stop class="room-data">
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

<style>
.editing-class-cell:hover {
    cursor: pointer;
    background-color: rgba(111, 111, 111, 0.5);
}
</style>