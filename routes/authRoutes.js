const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// LOGIN
router.get('/login', authController.mostrarLogin);
router.post('/login', authController.login);

// LOGOUT
router.get('/logout', authController.logout);

module.exports = router;