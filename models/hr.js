const pool = require('../utils/db');

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
    'SELECT lr.*, e.name, d.leave_name FROM leave_record lr LEFT JOIN employee e ON lr.employee_id = e.employee_id LEFT JOIN day_off d ON lr.leave_id = d.leave_id ORDER BY end DESC'
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

async function getSalary() {
  let data = await pool.query(`SELECT e.employee_id, e.name, e.registration_date, d.department_name,
    (SELECT sc.price FROM salary_count sc 
        INNER JOIN salary_item si ON sc.salary_item_id = si.salary_item_id 
        WHERE sc.employee_id = e.employee_id AND si.salary_item_name = '月薪') AS salary,
    (SELECT sc.price FROM salary_count sc 
        INNER JOIN salary_item si ON sc.salary_item_id = si.salary_item_id 
        WHERE sc.employee_id = e.employee_id AND si.salary_item_name = '獎金') AS bonus,
    (SELECT sc.price FROM salary_count sc 
        INNER JOIN salary_item si ON sc.salary_item_id = si.salary_item_id 
        WHERE sc.employee_id = e.employee_id AND si.salary_item_name = '誤餐補助') AS overtime_meal,
    (SELECT sc.price FROM salary_count sc 
        INNER JOIN salary_item si ON sc.salary_item_id = si.salary_item_id 
        WHERE sc.employee_id = e.employee_id AND si.salary_item_name = '加班補助') AS overtime,
    (SELECT sc.price FROM salary_count sc 
        INNER JOIN salary_item si ON sc.salary_item_id = si.salary_item_id 
        WHERE sc.employee_id = e.employee_id AND si.salary_item_name = '個人提繳6%') AS six_percent,
    (SELECT sc.price FROM salary_count sc 
        INNER JOIN salary_item si ON sc.salary_item_id = si.salary_item_id 
        WHERE sc.employee_id = e.employee_id AND si.salary_item_name = '代訂便當') AS bento,
    (SELECT sc.price FROM salary_count sc 
        INNER JOIN salary_item si ON sc.salary_item_id = si.salary_item_id 
        WHERE sc.employee_id = e.employee_id AND si.salary_item_name = '代扣稅額') AS tax,
    (SELECT sc.price FROM salary_count sc 
        INNER JOIN salary_item si ON sc.salary_item_id = si.salary_item_id 
        WHERE sc.employee_id = e.employee_id AND si.salary_item_name = '個人負擔勞保') AS labor_insurance,
    (SELECT sc.price FROM salary_count sc 
        INNER JOIN salary_item si ON sc.salary_item_id = si.salary_item_id 
        WHERE sc.employee_id = e.employee_id AND si.salary_item_name = '個人負擔健保') AS health_insurance,
    (SELECT sc.price FROM salary_count sc 
        INNER JOIN salary_item si ON sc.salary_item_id = si.salary_item_id 
        WHERE sc.employee_id = e.employee_id AND si.salary_item_name = '眷屬加保') AS family_dependants,
    (SELECT SUM(lr.hour) FROM leave_record lr
        INNER JOIN day_off do ON lr.leave_id = do.leave_id
        WHERE lr.employee_id = e.employee_id AND do.leave_name = '病假') AS sick,
    (SELECT SUM(lr.hour) FROM leave_record lr
        INNER JOIN day_off do ON lr.leave_id = do.leave_id
        WHERE lr.employee_id = e.employee_id AND do.leave_name = '事假') AS personal
    FROM employee e
    INNER JOIN department d ON e.department_id = d.id;`);
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
    [employee_id, name, department_id, gender, registration_date, birth, tel, phone, email, address, emergency_contact, emergency_contact_phone, sign, education, ext, note]
  );
}

async function addLeave(begin, end, employee_id, leave_id, hour, note, now) {
  await pool.execute(`INSERT INTO leave_record (employee_id, leave_id, hour, begin, end, note, time) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
    employee_id,
    leave_id,
    hour,
    begin,
    end,
    note,
    now,
  ]);
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
  getAllowance,
  getDeduction,
  getSalary,
  addEmployee,
  addLeave,
  updateEmployee,
};
