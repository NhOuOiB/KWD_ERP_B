const hrModel = require('../models/hr');
const moment = require('moment');

async function getDepartmentName(req, res) {
    let data = await hrModel.getDepartmentName();
    res.json(data);
}

async function getEmployee(req, res) {
    
    let { name } = req.query;
    let data = await hrModel.getEmployee(name);
    
    let cal = data.map((v) => {
        const seniority = moment().diff(v.registration_date, 'months');
        const seniority_year = moment().diff(v.registration_date, 'years');

        let specialLeave = 0;
        if (seniority >= 6 && seniority <= 12) {
            specialLeave = 3;
        } else if (seniority_year > 1) {
            specialLeave = 3;
            for (let i = 1; i < seniority_year + 1; i++) {
                switch (i) {
                    case 1:
                        specialLeave += 7;
                        break;
                    case 2:
                        specialLeave += 10;
                        break;
                    case 3:
                        specialLeave += 14;
                        break;
                    case 4:
                        specialLeave += 14;
                        break;
                    case 5:
                        specialLeave += 15;
                        break;
                    case 6:
                        specialLeave += 15;
                        break;
                    case 7:
                        specialLeave += 15;
                        break;
                    case 8:
                        specialLeave += 15;
                        break;
                    case 9:
                        specialLeave += 15;
                        break;
                    case 10:
                        specialLeave += 16;
                        break;
                    case 11:
                        specialLeave += 17;
                        break;
                    case 12:
                        specialLeave += 18;
                        break;
                    case 13:
                        specialLeave += 19;
                        break;
                    case 14:
                        specialLeave += 20;
                        break;
                    case 15:
                        specialLeave += 21;
                        break;
                    case 16:
                        specialLeave += 22;
                        break;
                    case 17:
                        specialLeave += 23;
                        break;
                    case 18:
                        specialLeave += 24;
                        break;
                    case 19:
                        specialLeave += 25;
                        break;
                    case 20:
                        specialLeave += 26;
                        break;
                    case 21:
                        specialLeave += 27;
                        break;
                    case 22:
                        specialLeave += 28;
                        break;
                    case 23:
                        specialLeave += 29;
                        break;
                    case 24:
                        specialLeave += 30;
                        break;
                    case 25:
                        specialLeave += 30;
                        break;
                    default:
                        specialLeave += 30;
                        break;
                }
            }
        }
        return { ...v, specialLeave };
    });
    console.log(cal);

    res.json(cal);
}

async function getEmployeeById(req, res) {
    let { eid } = req.query;
    let data = await hrModel.getEmployeeById(eid);
    res.json(data);
}

async function getLeave(req, res) {
    let data = await hrModel.getLeave();
    res.json(data);
}

async function getLeaveRecord(req, res) {
    let data = await hrModel.getLeaveRecord();
    res.json(data);
}

async function getStatus(req, res) {
    let data = await hrModel.getStatus();
    res.json(data);
}

async function addEmployee(req, res) {
    const {
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
    } = req.body.reduce((acc, { name, value }) => {
        acc[name] = value;
        return acc;
    }, {});
    hrModel.addEmployee(
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
    );
    res.json('成功');
}

async function addLeave(req, res) {
    req.body.map((v, i) => {
        const { begin, end, employee_id, leave_id, hour, note } = v;
        let now = moment().format();
        hrModel.addLeave(begin, end, employee_id, leave_id, hour, note, now);
    });
    res.json('成功');
}

async function updateEmployee(req, res) {
    console.log(req.body);
    const {
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
    } = req.body;
    hrModel.updateEmployee(
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
    );
    res.json('成功');
}

module.exports = {
    getDepartmentName,
    getEmployee,
    getEmployeeById,
    getLeave,
    getLeaveRecord,
    getStatus,
    addEmployee,
    addLeave,
    updateEmployee,
};
