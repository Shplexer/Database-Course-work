import mysql from 'mysql';
import { openSync } from 'original-fs';

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '10501',
    database: 'schedule'
});


connection.connect(function (err) {
    // in case of error
    console.log("Connected to DB");
    if (err) {
        console.log(err.code);
        console.log(err.fatal);
    }
});

export async function postData(opts) {
    console.log(opts);
    let query;
    let searchValues = [];
    console.log(opts.req);
    switch (opts.req) {
        case `deleteClass`:
        query = `DELETE FROM classes WHERE id = ?`;    
        searchValues = [opts.id];
        break;
        case `addClass`:
            query = `
                INSERT INTO classes (
                    class_name_id,
                    group_id, 
                    time_id, 
                    teacher_id, 
                    room_id, 
                    week_type_id,
                    day_id
                )
                VALUES ('?', '?', '?', '?', '?', '?', '?');`;
            searchValues = [
                opts.className,
                opts.group,
                opts.time,
                opts.teacher,
                opts.room,
                opts.week,
                opts.day
            ];
            break;
        case `editClass`:
            query = `
                UPDATE classes
                SET class_name_id = ?,
                    group_id = ?,
                    teacher_id = ?,
                    room_id = ?
                WHERE
                    id = ?;
                    `
            searchValues = [
                opts.className,
                opts.group,
                opts.teacher,
                opts.room,
                opts.id
            ];
            break;
        default:
            console.log(`Invalid type: ${opts.req}`);
            return;
    }
    return new Promise((resolve, reject) => {
        connection.query(query, searchValues, function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                console.log(`query: ${query}`);
                console.log(`The solution is:${opts.req} ${JSON.stringify(results)}`);
                resolve(results);
            }
        });
    });
}
export async function getData(opts) {
    console.log(opts);

    let query;
    let searchValues = [];
    console.log(opts.req);
    switch (opts.req) {
        case `validate`:
            switch (opts.validation) {
                case `teacher`:
                    query = `SELECT COUNT(*) FROM classes WHERE (
                        teacher_id = ? 
                        AND time_id = ? 
                        AND day_id = ? 
                        AND week_type_id = ? 
                        AND class_name_id != ?
                        AND group_id != ?
                    );`;
                    searchValues = [opts.teacher, opts.time, opts.day, opts.week, opts.className, opts.group];
                    break;
                case `group`:
                    break;
                case `room`:
                    query = `SELECT COUNT(*) FROM classes WHERE (
                        room_id = ? 
                        AND time_id = ? 
                        AND day_id = ? 
                        AND week_type_id = ? 
                        AND class_name_id != ?
                        AND group_id != ?
                    );`;
                    searchValues = [opts.room, opts.time, opts.day, opts.week, opts.className, opts.group];
                    break;
            }
            break;
        case `teachers`:
            query = `SELECT * FROM users WHERE role = 2;`;
            break;
        case `groups`:
            query = `SELECT * FROM student_groups;`;
            break;
        case `subjects`:
            query = `SELECT * FROM class_types;`;
            break;
        case `rooms`:
            query = `
            SELECT
                rooms.id AS id,
                rooms.room_num AS room_num,
                addresses.address AS address
                from rooms
            INNER JOIN
                addresses ON rooms.address_id = addresses.id;`;
            break;
        case `days`:
            query = `SELECT * FROM days_of_the_week;`;
            break;
        case `class_times`:
            query = `SELECT id, date_format(class_start, '%k:%i') as class_start, date_format(class_end, '%k:%i') as class_end FROM class_times;`;
            break;
        case `login`:
            query = `SELECT * FROM login_info where login = ? and password = ?;`;
            searchValues = [opts.username, opts.password];

            break;
        case `user`:
            query = `
                SELECT users.id, 
                    users.surname,
                    users.name,
                    users.patronymic,
                    roles.name AS role,
                    roles.id AS role_id,
                    departments.id AS department_id
                FROM users
                    INNER JOIN
                        roles on users.role = roles.id
                    INNER JOIN
                        departments on users.department_id = departments.id
                WHERE users.login_info_id = ?;`;
            searchValues = [opts.login_id];
            break;
        case `timetable`:
            query = `
                SELECT 
                    classes.id AS id,
                    users.id AS teacher_id,
                    student_groups.id AS group_id,
                    class_types.id AS class_type_id,
                    rooms.id AS room_id,
                    days_of_the_week.id AS day,
                    class_times.id AS class_num,
                    class_types.name AS class_name,
                    class_types.class_type AS class_type,
                    date_format(class_start, '%k:%i') as class_start,
                    date_format(class_end, '%k:%i') as class_end,
                    days_of_the_week.name AS day_name,
                    users.surname AS teacher_surname,
                    users.name AS teacher_name,
                    users.patronymic AS teacher_patronymic,
                    rooms.room_num AS room_num,
                    addresses.address AS address,
                    addresses.link AS address_URL,
                    student_groups.group_name AS group_name,
                    classes.week_type_id AS week_type_id
                    FROM
                    classes
                        INNER JOIN
                    class_types ON classes.class_name_id = class_types.id
                        INNER JOIN
                    class_times ON classes.time_id = class_times.id
                        INNER JOIN
                    days_of_the_week ON classes.day_id = days_of_the_week.id
                        INNER JOIN
                    users ON classes.teacher_id = users.id
                        INNER JOIN
                    rooms ON classes.room_id = rooms.id
                        INNER JOIN
                    addresses ON rooms.address_id = addresses.id
                        INNER JOIN
                    student_groups ON classes.group_id = student_groups.id
                WHERE
                    group_id = ? AND week_type_id = ?;`
            searchValues = [opts.group, opts.week];
            break;
        default:
            console.log(`Invalid type: ${opts.req}`);
            return;
    }

    return new Promise((resolve, reject) => {
        connection.query(query, searchValues, function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                console.log(`query: ${query}`);
                console.log(`The solution is:${opts.req} ${JSON.stringify(results)}`);
                resolve(results);
            }
        });
    });
}


export function closeConnection() {
    console.log("Connection closed");
    connection.end(function () {
    });
}