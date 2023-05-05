const hrModel = require('../models/hr');
const moment = require('moment');

async function getDepartmentName(req, res) {
    let data = await hrModel.getDepartmentName();
    res.json(data);
}

async function getEmployee(req, res) {
    let { name } = req.query;
    let data = await hrModel.getEmployee(name);
    res.json(data);
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
