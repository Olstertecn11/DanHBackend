const express = require('express');
const { registerUser, loginUser, getProfile, updateProfile, deleteProfile,getAllRecords } = require('../controler/authController');


const router = express.Router();

router.post('/registro/:correo', registerUser);
router.post('/login', loginUser);

router.get('/perfil/:correo', getProfile);
router.post('/perfil/:correo', updateProfile);
router.delete('/perfil/:correo', deleteProfile);
router.get('/perfiles/', getAllRecords);

module.exports = router;