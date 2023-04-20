const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hr');

router.get('/getDepartmentName', hrController.getDepartmentName);

router.get('/getEmployee', hrController.getEmployee)

router.get('/getEmployeeById', hrController.getEmployeeById)

router.post('/addEmployee', hrController.addEmployee);

module.exports = router;
