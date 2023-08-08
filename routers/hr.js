const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hr');

router.get('/getDepartmentName', hrController.getDepartmentName);

router.get('/getEmployee', hrController.getEmployee);

router.get('/getEmployeeById', hrController.getEmployeeById);

router.get('/getLeave', hrController.getLeave);

router.get('/getLeaveRecord', hrController.getLeaveRecord);

router.get('/getStatus', hrController.getStatus);

router.get('/getAllowance', hrController.getAllowance);

router.get('/getDeduction', hrController.getDeduction);

router.get('/getSalary', hrController.getSalary);

router.get('/getSalaryRecord', hrController.getSalaryRecord);

router.post('/addEmployee', hrController.addEmployee);

router.post('/addLeave', hrController.addLeave);

router.post('/addSalary', hrController.addSalary);

router.put('/updateEmployee', hrController.updateEmployee);

module.exports = router;
