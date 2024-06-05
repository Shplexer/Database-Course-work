<script setup>
import { ref, defineProps, onMounted, defineEmits } from 'vue';

const props = defineProps({
    dataToEdit: Object,
    dataToEditDay: Number,
    dataToEditTime: Number,
    dataToEditWeek: Number,
    dataToEditGroup: Number,
    userRole: String
});

const emit = defineEmits(['showOverlay']);

console.log("===", props.dataToEdit.value, props.dataToEditDay, props.dataToEditTime, props.dataToEditWeek, props.dataToEditGroup);

const isHidden = ref(true);
const errMessage = ref("");
//При билде приложения добавить .value к следующим трем пропам (напр props.dataToEdit.value.teacher_id )
const selectedTeacher = ref(props.dataToEdit.teacher_id);
const selectedSubject = ref(props.dataToEdit.class_type_id);
const selectedRoomNum = ref(props.dataToEdit.room_id);


const renderEditDialogue = ref(false);
const procedureName = ref("");
const AllTeachers = ref([{}]);
const AllSubjects = ref([{}]);
const AllRooms = ref([{}]);

//При билде добавить .value (props.dataToEdit.value)
if(Object.keys(props.dataToEdit).length != 0){
    procedureName.value = "Редактирование";
}
else{
    procedureName.value = "Добавление";
}
onMounted(async () => {
    try {
        AllTeachers.value = await window.Bridge.GET({ req: 'teachers' });
        AllSubjects.value = await window.Bridge.GET({ req: 'subjects' });
        AllRooms.value = await window.Bridge.GET({ req: 'rooms' });
    }
    finally {
        renderEditDialogue.value = true;
    }
})
async function logSelectedOptions() {
    if(await validateEdits()){
        //При билде добавить .value (props.dataToEdit.value)  
        if(Object.keys(props.dataToEdit).length != 0){
            await window.Bridge.POST({
                req: 'editClass',
                className: selectedSubject.value,
                group: props.dataToEditGroup,
                room: selectedRoomNum.value,                
                teacher: selectedTeacher.value,
                id: props.dataToEdit.value.id
            });
        }
        else{
            console.log("adding class:");
            await window.Bridge.POST({
                req: 'addClass',
                className: selectedSubject.value,
                group: props.dataToEditGroup,
                room: selectedRoomNum.value,                
                teacher: selectedTeacher.value,
                week: props.dataToEditWeek,
                day: props.dataToEditDay,
                time: props.dataToEditTime
            });
        }
        emit('showOverlay');
    }
    else{
        console.log("Ошибка");
    }
}
async function deleteClass(){
    //При билде добавить .value (props.dataToEdit.value)
    if(Object.keys(props.dataToEdit).length != 0){
        await window.Bridge.POST({
            req: 'deleteClass',
            //Может быть добавить .value для билда (? не уверен -- проверить потом)
            id: props.dataToEdit.id
        })
    }
    emit('showOverlay');
}
async function validateEdits() {
    try {
        const otherTeacherClasses = await window.Bridge.GET({
            req: 'validate',
            validation: 'teacher',
            teacher: selectedTeacher.value,
            day: props.dataToEditDay,
            time: props.dataToEditTime,
            week: props.dataToEditWeek,
            className: selectedSubject.value,
            group: props.dataToEditGroup
        });

        const otherRoomClasses = await window.Bridge.GET({
            req: 'validate',
            validation: 'room',
            room: selectedRoomNum.value,
            day: props.dataToEditDay,
            time: props.dataToEditTime,
            week: props.dataToEditWeek,
            className: selectedSubject.value,
            group: props.dataToEditGroup
        });
        if (otherRoomClasses[0]['COUNT(*)'] != 0 && otherTeacherClasses[0]['COUNT(*)'] != 0) {
            errMessage.value = "Преподаватель и аудитория в это время уже заняты";
            isHidden.value = false;
        }
        else if (otherTeacherClasses[0]['COUNT(*)'] != 0) {
            errMessage.value = "Преподаватель уже имеет пару в это время и этот день";
            isHidden.value = false;
        }
        else if (otherRoomClasses[0]['COUNT(*)'] != 0) {
            errMessage.value = "В этой аудитории уже есть пара в это время и этот день";
            isHidden.value = false;
        }
        else {
            isHidden.value = true;
        }
        return isHidden.value;
    } catch (error) {
        console.error(' encountered an unhandled exception: ', error);
        throw error;
    }
}
</script>

<template>
    <div class="top-body-part centered-elements-container">
        <h1>{{procedureName}}</h1>
        <p class="errmessage" :class="{ hidden: isHidden }">Ошибка! {{ errMessage }}</p>

    </div>
    <div v-if="renderEditDialogue" id="edit-options">

        <p v-if ="userRole == 'Администратор'">Преподаватель:</p>
        <select v-if="userRole == 'Администратор'" v-model="selectedTeacher" name="teacher">
            <option v-for="teacher in AllTeachers" :key="teacher.id" :value="teacher.id">
                {{ `${teacher.surname} ${teacher.name} ${teacher.patronymic}` }} 
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
    <button @click="deleteClass"> Удалить </button>

</template>

<style>
select{
    border-radius: 5px;
}
#edit-options{
    padding-bottom: 25px;
}
</style>