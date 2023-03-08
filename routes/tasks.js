/*
Tasks Routes
/api/tasks
*/


const { Router } = require('express');
const { check } = require('express-validator')
const { getTasks, createTask, editTask, deleteTask } = require('../controllers/tasks');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();

//OBTAIN TASKS

router.use( validateJWT );

router.get('/', getTasks )


// ver  mas validaciones acá
router.post(
    '/newTask',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('description', 'La descripción es obligatorio').not().isEmpty(),
    ],
    validateFields,
     createTask )

router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('description', 'La descripción es obligatorio').not().isEmpty(),
    ],
    validateFields,
    editTask )

router.delete('/:id', deleteTask )


module.exports = router