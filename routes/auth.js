/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/
const { Router } = require('express');
const router = Router();
const { createUser, renewToken, loginUser } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

router.post(
    '/new',
    [ 
        check('name', 'El nombre es obligatorio').not().isEmpty(), // Que el nombre no este vacio
        check('email', 'El email es obligatorio').isEmail(), // Que el email sea un email
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        validateFields,
         // Que el password sea de 6 caracteres 
    ],
     createUser);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(), // Que el email sea un email
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        validateFields // Que el password sea de 6 caracteres
    ],
     loginUser );


router.get('/renew', validateJWT, renewToken);


module.exports = router;