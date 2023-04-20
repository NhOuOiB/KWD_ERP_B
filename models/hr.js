const pool = require('../utils/db');

async function getDepartmentName() {
    let data = await pool.query('SELECT * FROM department');
    return data[0];
}

async function getEmployee(keyWord = '') {
    let data = await pool.query('SELECT * FROM employee WHERE status = 1 AND name Like ?', [`%${keyWord}%`]);
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
    console.log(data);
    return data;
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

module.exports = { getEmployee, getDepartmentName, getEmployeeById, addEmployee };
