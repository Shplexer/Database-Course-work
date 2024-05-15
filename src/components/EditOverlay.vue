<script setup>
import { ref, defineProps, onMounted } from 'vue';

const props = defineProps({
    dataToEdit: Object
});

console.log("===", props.dataToEdit);

const selectedTeacher = ref(props.dataToEdit.teacher_id);
const selectedGroup = ref(props.dataToEdit.group_id);
const selectedSubject = ref(props.dataToEdit.class_type_id);
const selectedRoomNum = ref(props.dataToEdit.room_id);
const renderEditDialogue = ref(false);
const procedureName = ref("");
const AllTeachers = ref([{}]);
const AllGroups = ref([{}]);
const AllSubjects = ref([{}]);
const AllRooms = ref([{}]);

if(Object.keys(props.dataToEdit).length != 0){
    procedureName.value = "Редактирование";
}
else{
    procedureName.value = "Добавление";
}
onMounted(async () => {
    try {
        AllTeachers.value = await window.Bridge.GET({ req: 'teachers' });
        AllGroups.value = await window.Bridge.GET({ req: 'groups' });
        AllSubjects.value = await window.Bridge.GET({ req: 'subjects' });
        AllRooms.value = await window.Bridge.GET({ req: 'rooms' });
    }
    finally {
        renderEditDialogue.value = true;
        console.log("AllTeachers", AllTeachers.value);
        console.log("AllGroups", AllGroups.value);
        console.log("AllSubjects", AllSubjects.value);
        console.log("AllRooms", AllRooms.value);
    }
})
async function logSelectedOptions() {
    if(await validateEdits()){
        if(Object.keys(props.dataToEdit).length != 0){
            console.log("Editing class:", props.dataToEdit.id)
            console.log("Selected teacher:", selectedTeacher.value);
            console.log("Selected group:", selectedGroup.value);
            console.log("Selected class name:", selectedSubject.value);
            console.log("Selected room number:", selectedRoomNum.value);
            await window.Bridge.POST({
                req: 'editClass',
                className: selectedSubject.value,
                group: selectedGroup.value,
                time: props.dataToEdit.class_num,
                room: selectedRoomNum.value,                
                teacher: selectedTeacher.value,
                week: props.dataToEdit.week_type_id,
                id: props.dataToEdit.id
            });
        }
        else{
            console.log("adding class:");
        }
    }
    else{
        console.log("Invalid edits. Please check your input and try again.")
    }
}
async function validateEdits() {
    try {
        //Проверки:
        // У преподавателя нет другой пары в это время и этот день 
        // У группы нет другой пары в это время и этот день
        // В этой аудитории нет другой пары в это время и этот день
        const otherTeacherClasses = await window.Bridge.GET({
            req: 'validate',
            validation: 'teacher',
            teacher: selectedTeacher.value,
            day: props.dataToEdit.day,
            time: props.dataToEdit.class_num,
            week: props.dataToEdit.week_type_id
        });

        const otherRoomClasses = await window.Bridge.GET({
            req: 'validate',
            validation: 'room',
            room: selectedRoomNum.value,
            day: props.dataToEdit.day,
            time: props.dataToEdit.class_num,
            week: props.dataToEdit.week_type_id
        });

        if ( otherTeacherClasses[0]['COUNT(*)'] != 0 || otherRoomClasses[0]['COUNT(*)'] != 0) {
            return false;
        }
        else {
            return true;
        }
    } catch (error) {
        console.error('validateEdits() encountered an unhandled exception: ', error);
        throw error;
    }
}
</script>

<template>
    <div class="top-body-part centered-elements-container">
        <h1>{{procedureName}}</h1>

    </div>
    <div v-if="renderEditDialogue" id="edit-options">

        <p>Преподаватель:</p>
        <select v-model="selectedTeacher" name="teacher">
            <option v-for="teacher in AllTeachers" :key="teacher.id" :value="teacher.id">
                {{ `${teacher.surname} ${teacher.name} ${teacher.patronymic}` }} 
            </option>
        </select>

        <p>Группа:</p>
        <select v-model="selectedGroup" name="group_name">
            <option v-for="group in AllGroups" :key="group.id" :value="group.id">
                {{ `${group.group_name}` }}
            </option>
        </select>

        <p>Предмет:</p>
        <select v-model="selectedSubject" name="class_name">
            <option v-for="subject in AllSubjects" :key="subject.id" :value="subject.id">
                {{ `${subject.name}, ${subject.class_type}` }}
            </option>
        </select>

        <p>Аудитория:</p>
        <select v-model="selectedRoomNum" name="room_num">
            <option v-for="room in AllRooms" :key="room.id" :value="room.id">
                {{ `${room.address}, ${room.room_num} ауд.` }}
            </option>
        </select>
    </div>
    <button @click="logSelectedOptions">Сохранить</button>
    <button> Удалить </button>

</template>

<style>
select{
    border-radius: 5px;
}
#edit-options{
    padding-bottom: 25px;
}
</style>