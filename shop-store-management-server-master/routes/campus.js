//资讯相关
const express = require('express');
const router = express.Router();
const campusController = require('../controllers/campusController');

// 资讯的增删改查
router.post('/addCampus', campusController.addCampus);
router.post('/editCampus', campusController.editCampus);
router.post('/deleteCampus', campusController.deleteCampus);
router.post('/getCampusList', campusController.getCampusList);

module.exports = router;