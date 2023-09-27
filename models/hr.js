const pool = require('../utils/db');
const moment = require('moment');

async function getDepartmentName() {
  let data = await pool.query('SELECT * FROM department WHERE enable = 1');
  return data[0];
}

async function getEmployee(keyWord = '') {
  let data = await pool.query(
    'SELECT e.*, COALESCE(SUM(lr.hour), 0) AS total_hour, d.department_name FROM employee e LEFT JOIN leave_record lr ON e.employee_id = lr.employee_id AND lr.leave_id = 3 LEFT JOIN department d ON e.department_id = d.department_id WHERE e.name LIKE ? GROUP BY e.employee_id',
    [`%${keyWord}%`]
  );

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
    'SELECT lr.*, e.name, d.leave_name, SUM(lr.hour) as total_hour  FROM leave_record lr LEFT JOIN employee e ON lr.employee_id = e.employee_id LEFT JOIN day_off d ON lr.leave_id = d.leave_id GROUP BY begin, end, employee_id ORDER BY begin DESC'
  );
  return data[0];
}

async function getStatus() {
  let data = await pool.query('SELECT * FROM status WHERE enable = 1');
  return data[0];
}

async function getAllowance() {
  let data = await pool.query('SELECT * FROM salary_item WHERE polarity = "+"');
  return data[0];
}

async function getDeduction() {
  let data = await pool.query('SELECT * FROM salary_item WHERE polarity = "-"');
  return data[0];
}

async function getSalary(time) {
  let record = await pool.query(
    `SELECT sr.*, e.name, e.registration_date, d.department_name 
    FROM salary_record sr
    INNER JOIN employee e ON sr.employee_id = e.employee_id
    INNER JOIN department d ON e.department_id = d.department_id
    WHERE time LIKE ?
    ORDER BY e.employee_id`,
    [time + '%']
  );
  let data = await pool.query(
    `SELECT e.employee_id, e.name, registration_date, d.department_name, e.six_percent AS six, e.salary, 
        (SELECT SUM(lr.hour) FROM leave_record lr
        INNER JOIN day_off do ON lr.leave_id = do.leave_id
        WHERE lr.employee_id = e.employee_id AND do.leave_name = '病假' AND lr.month LIKE ? ) AS sick, 
        (SELECT SUM(lr.hour) FROM leave_record lr
        INNER JOIN day_off do ON lr.leave_id = do.leave_id
        WHERE lr.employee_id = e.employee_id AND do.leave_name = '事假' AND lr.month LIKE ?) AS personal,
        (CASE WHEN e.family_dependant_name_1 IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN e.family_dependant_name_2 IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN e.family_dependant_name_3 IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN e.family_dependant_name_4 IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN e.family_dependant_name_5 IS NOT NULL THEN 1 ELSE 0 END) AS family,
        0 AS sick_leave,
        0 AS personal_leave,
        0 AS bonus,
        0 AS overtime,
        0 AS overtime_meal, 
        0 AS bento, 
        0 AS tax,
        0 AS six_percent,
        0 AS total_family_dependants,
        0 AS labor_insurance,
        0 AS health_insurance,
        0 AS total,
        0 AS deduction,
        0 AS actually
        FROM employee e 
        INNER JOIN department d ON e.department_id = d.id
        WHERE e.status != 1 AND e.status != 3;`,
    [time + '%', time + '%']
  );
  if (record[0].length > 0) {
    return [{ record: true }, record[0]];
  }
  return [{ record: false }, data[0]];
}

async function getSalaryRecord() {
  let data = await pool.query(`SELECT DATE_FORMAT(time, '%Y-%m') AS month FROM salary_record GROUP BY month ORDER BY month DESC`);

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
  note,
  family_dependant_name_1,
  family_dependant_relationship_1,
  family_dependant_name_2,
  family_dependant_relationship_2,
  family_dependant_name_3,
  family_dependant_relationship_3,
  family_dependant_name_4,
  family_dependant_relationship_4,
  family_dependant_name_5,
  family_dependant_relationship_5,
  six,
  salary
) {
  let result = await pool.execute(
    `INSERT INTO employee 
    (employee_id,
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
    family_dependant_name_1,
    family_dependant_relationship_1,
    family_dependant_name_2,
    family_dependant_relationship_2,
    family_dependant_name_3,
    family_dependant_relationship_3,
    family_dependant_name_4,
    family_dependant_relationship_4,
    family_dependant_name_5,
    family_dependant_relationship_5,
    six_percent,
    salary) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      family_dependant_name_1,
      family_dependant_relationship_1,
      family_dependant_name_2,
      family_dependant_relationship_2,
      family_dependant_name_3,
      family_dependant_relationship_3,
      family_dependant_name_4,
      family_dependant_relationship_4,
      family_dependant_name_5,
      family_dependant_relationship_5,
      six,
      salary,
    ]
  );
}

async function addLeave(begin, end, month, employee_id, leave_id, hour, note, now) {
  console.log(month);
  await pool.execute(`INSERT INTO leave_record (employee_id, leave_id, hour, begin, end, note, time, month) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
    employee_id,
    leave_id,
    hour,
    begin,
    end,
    note,
    now,
    month,
  ]);
}

async function addSalary(salary, now) {
  let timeCheck = await pool.query(`SELECT * FROM salary_record WHERE time LIKE ?`, [salary[0].time + `%`]);
  console.log(moment(salary[0].time).format());

  if (timeCheck[0].length > 0) {
    return { message: '該月份已經有紀錄了' };
  }
  salary.forEach(async (item) => {
    let {
      employee_id,
      salary,
      sick_leave,
      personal_leave,
      bonus,
      overtime,
      overtime_meal,
      labor_insurance,
      health_insurance,
      six_percent,
      bento,
      tax,
      total_family_dependants,
      total,
      deduction,
      actually,
      time,
    } = item;
    let result = await pool.execute(
      'INSERT INTO salary_record (employee_id, salary, sick_leave, personal_leave, bonus, overtime, overtime_meal, labor_insurance, health_insurance, family_dependants, six_percent, bento, tax, total, deduction, actually, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        employee_id,
        salary,
        sick_leave,
        personal_leave,
        bonus,
        overtime,
        overtime_meal,
        labor_insurance,
        health_insurance,
        total_family_dependants,
        six_percent,
        bento,
        tax,
        total,
        deduction,
        actually,
        moment(time).format(),
      ]
    );
  });
  return { message: '薪資紀錄新增成功' };
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
  status_id,
  bank,
  family_dependant_name_1,
  family_dependant_name_2,
  family_dependant_name_3,
  family_dependant_name_4,
  family_dependant_name_5,
  family_dependant_relationship_1,
  family_dependant_relationship_2,
  family_dependant_relationship_3,
  family_dependant_relationship_4,
  family_dependant_relationship_5,
  salary,
  six_percent
) {
  let result = await pool.execute(
    `UPDATE employee SET employee_id = ?,  name = ? , department_id = ?, registration_date = ?, leave_date = ?, tel = ?, phone = ?, email = ?, address= ?, gender = ?, ext = ?, emergency_contact = ?, emergency_contact_phone = ?, birth = ?, sign = ?, education = ?, note = ?, status = ?, bank = ?, family_dependant_name_1 = ?, family_dependant_name_2 = ?, family_dependant_name_3 = ?, family_dependant_name_4 = ?, family_dependant_name_5 = ?, family_dependant_relationship_1 = ?, family_dependant_relationship_2 = ?, family_dependant_relationship_3 = ?, family_dependant_relationship_4 = ?, family_dependant_relationship_5 = ?, salary = ?, six_percent = ? WHERE id = ?`,
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
      bank,
      family_dependant_name_1,
      family_dependant_name_2,
      family_dependant_name_3,
      family_dependant_name_4,
      family_dependant_name_5,
      family_dependant_relationship_1,
      family_dependant_relationship_2,
      family_dependant_relationship_3,
      family_dependant_relationship_4,
      family_dependant_relationship_5,
      salary,
      six_percent,
      id,
    ]
  );

  if (result[0].changedRows == 1) {
    return { message: '更新成功' };
  } else if (result[0].changedRows == 0) {
    return { message: '沒有資料更新' };
  } else {
    return { message: '更新失敗' };
  }
}

module.exports = {
  getEmployee,
  getDepartmentName,
  getEmployeeById,
  getLeave,
  getLeaveRecord,
  getStatus,
  getAllowance,
  getDeduction,
  getSalary,
  getSalaryRecord,
  addEmployee,
  addLeave,
  addSalary,
  updateEmployee,
};
