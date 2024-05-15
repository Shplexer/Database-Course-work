<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';
//Поменять получением из бд (?)
const times = ref([
    {"id":1,"class_start":"9:30","class_end":"11:10"},
    {"id":2,"class_start":"11:30","class_end":"13:10"},
    {"id":3,"class_start":"14:00","class_end":"15:40"},
    {"id":4,"class_start":"16:00","class_end":"17:40"},
    {"id":5,"class_start":"18:00","class_end":"19:40"},
    {"id":6,"class_start":"20:00","class_end":"21:30"}
]);
const daysOfTheWeek = ref([`Понедельник`, `Вторник`, `Среда`, `Четверг`, `Пятница`]);
const dataToEdit = ref({});
const emit = defineEmits(['showOverlay'])

const props = defineProps({
    timetableData: Array,
    currentUser: Object
});

const isDataLoaded = ref(false);

onMounted(async () => {
    try {
        const fetchedTimes = await window.Bridge.GET({ req: 'class_times' });
        times.value = fetchedTimes;
    } catch (error) {
        console.error('Failed to load times:', error);
    } finally {
        isDataLoaded.value = true; // Set this to true once data is loaded or if there's an error
    }
});

console.log("@@@", props.timetableData);
console.log("@@@@", props.currentUser);

const setClass = (timeIndex, dayIndex) => {
    return props.timetableData.find(
        data => parseInt(data.class_num) === timeIndex + 1 && parseInt(data.day) === dayIndex + 1
    );
};

const callEdit = (timeIndex, dayIndex) => {
    // TODO: Вывод оверлея редактирования, с передачей ему classInfo
    // если classInfo не пустой, в оверлей редактирования передается название редактирования
    // иначе, передается название добавления
    const classInfo = setClass(timeIndex, dayIndex);
    if(classInfo) {
        console.log('edit called', classInfo);
        dataToEdit.value = classInfo;
    }
    else {
        console.log('add called');
        dataToEdit.value = {};
    }
    emit('showOverlay', { dataToEdit: dataToEdit });
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
    <table class="full-width-table" id="timetable" v-if="isDataLoaded">
        <!-- Header row with days of the week -->
        <thead>
            <tr>
                <th></th>
                <th v-for="day in daysOfTheWeek" :key="day">{{ day }}</th>
            </tr>
        </thead>
        <tbody>
            <!-- Rows for each time slot -->
            <tr v-for="(time, timeIndex) in times" :key="time.id">
                <!-- First column with time -->
                <td>{{ `${time.class_start} - ${time.class_end}` }}</td>
                <!-- Data cells -->
                <td v-for="(day, dayIndex) in daysOfTheWeek" :key="day"
                    :class="{ 'editing-class-cell': canBeEditable(timeIndex, dayIndex) }"
                    @click.capture="canBeEditable(timeIndex, dayIndex) && callEdit(timeIndex, dayIndex)">
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