const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hr');

router.get('/getDepartmentName', hrController.getDepartmentName);

router.get('/getEmployee', hrController.getEmployee)

router.get('/getEmployeeById', hrController.getEmployeeById)

router.get('/getLeave', hrController.getLeave);

router.get('/getLeaveRecord', hrController.getLeaveRecord);

router.post('/addEmployee', hrController.addEmployee);

router.post('/addLeave', hrController.addLeave);

module.exports = router;
