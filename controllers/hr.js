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
    console.log(eid)
    let data = await hrModel.getEmployeeById(eid)
    res.json(data)
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
    let now = moment().format();
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

module.exports = {
    getDepartmentName,
    getEmployee,
    getEmployeeById,
    addEmployee,
};
