import mysql from 'mysql';

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
//export function getData() {
//    let rows;
//    connection.query(`SELECT id, date_format(class_start, '%k:%i') as class_start, date_format(class_end, '%k:%i') as class_end FROM class_times;`, function (error, results, fields) {
//        if (error) throw error;
//        rows = [results];
//        console.log('The solution is1: ', results);
//    });
//    //let query = "SELECT id, date_format(class_start, '%k:%i') as class_start, date_format(class_end, '%k:%i') as class_end FROM class_times;";
//    //Close the connection
//    console.log('The solution is2: ', [rows]);
//    
//    return rows;
//    
//}  
export async function getData(opts) {
    console.log(opts);

    let query;
    let searchValues = [];
    console.log(opts.req);
    switch (opts.req) {
        case `class_times`:
            query = `SELECT id, date_format(class_start, '%k:%i') as class_start, date_format(class_end, '%k:%i') as class_end FROM class_times;`;
            break;
        case `groups`:
            query = `SELECT * FROM student_groups;`;
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
                    class_types.name AS class_name,
                    class_types.class_type AS class_type,
                    class_times.id AS class_num,
                    days_of_the_week.id AS day,
                    users.id AS teacher_id,
                    users.surname AS teacher_surname,
                    users.name AS teacher_name,
                    users.patronymic AS teacher_patronymic,
                    rooms.room_num AS room_num,
                    addresses.address AS address,
                    addresses.link AS address_URL
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
                    addresses ON classes.address_id = addresses.id
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