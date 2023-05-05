const pool = require('../utils/db');

async function getDepartmentName() {
    let data = await pool.query('SELECT * FROM department WHERE enable = 1');
    return data[0];
}

async function getEmployee(keyWord = '') {
    let data = await pool.query('SELECT * FROM employee WHERE name Like ?', [`%${keyWord}%`]);
    return data[0];
}

async function getEmployeeById(eid = '') {
    let [data] = await pool.query(
        `
  SELECT e.*, d.department_name, s.status_name
  FROM employee e
  LEFT JOIN department d ON e.department_id = d.department_id
  LEFT JOIN status s ON e.status = s.status_id
  WHERE e.employee_id = ?
`,
        [eid]
    );
    return data;
}

async function getLeave() {
    let data = await pool.query('SELECT * FROM day_off WHERE enable = 1');
    return data[0];
}

async function getLeaveRecord() {
    let data = await pool.query(
        'SELECT lr.*, e.name, d.leave_name FROM leave_record lr LEFT JOIN employee e ON lr.employee_id = e.employee_id LEFT JOIN day_off d ON lr.leave_id = d.leave_id ORDER BY time DESC'
    );
    return data[0];
}

async function getStatus() {
    let data = await pool.query('SELECT * FROM status WHERE enable = 1');
    return data[0];
}

async function addEmployee(
    employee_id,
    name,
    department_id,
    gender,
    registration_date,
    birth,
    tel,
    phone,
    email,
    address,
    emergency_contact,
    emergency_contact_phone,
    sign,
    education,
    ext,
    note
) {
    let result = await pool.execute(
        `INSERT INTO employee ( employee_id,
        name,
        department_id,
        gender,
        registration_date,
        birth,
        tel,
        phone,
        email,
        address,
        emergency_contact,
        emergency_contact_phone,
        sign,
        education,
        ext,
        note) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,
        [
            employee_id,
            name,
            department_id,
            gender,
            registration_date,
            birth,
            tel,
            phone,
            email,
            address,
            emergency_contact,
            emergency_contact_phone,
            sign,
            education,
            ext,
            note,
        ]
    );
}

async function addLeave(begin, end, employee_id, leave_id, hour, note, now) {
    await pool.execute(
        `INSERT INTO leave_record (employee_id, leave_id, hour, begin, end, note, time) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [employee_id, leave_id, hour, begin, end, note, now]
    );
}

async function updateEmployee(
    id,
    employee_id,
    name,
    department_id,
    registration_date,
    leave_date,
    tel,
    phone,
    email,
    address,
    gender,
    ext,
    emergency_contact,
    emergency_contact_phone,
    birth,
    sign,
    education,
    note,
    status_id
) {
    await pool.execute(
        `UPDATE employee SET employee_id = ?,  name = ? , department_id = ?, registration_date = ?, leave_date = ?, tel = ?, phone = ?, email = ?, address= ?, gender = ?, ext = ?, emergency_contact = ?, emergency_contact_phone = ?, birth = ?, sign = ?, education = ?, note = ?, status = ? WHERE id = ?`,
        [
            employee_id,
            name,
            department_id,
            registration_date,
            leave_date,
            tel,
            phone,
            email,
            address,
            gender,
            ext,
            emergency_contact,
            emergency_contact_phone,
            birth,
            sign,
            education,
            note,
            status_id,
            id,
        ]
    );
}

module.exports = {
    getEmployee,
    getDepartmentName,
    getEmployeeById,
    getLeave,
    getLeaveRecord,
    getStatus,
    addEmployee,
    addLeave,
    updateEmployee,
};
