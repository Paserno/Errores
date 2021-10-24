/*
    path: api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');
//Controladores
const { crearUsuario, Login, RevalidarToken } = require('../controller/authController');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

// Crear Nuevos Usuarios
router.post('/new',[
    //Tarea
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    check('password','La contraseña es obligatorio').not().isEmpty(),
    validarCampos
], crearUsuario);


//Login
router.post('/',[
    check('email','El email es obligatorio').isEmail(),
    check('password','La contraseña es obligatorio').not().isEmpty(),
    validarCampos
], Login);
//Revalidar Token
router.get('/renew',validarJWT, RevalidarToken);


module.exports = router;