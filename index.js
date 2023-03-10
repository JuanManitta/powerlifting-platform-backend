const express = require('express');
const { dbConnection } = require('./db/config');
require('dotenv').config();
const authRouter = require('./routes/auth');
const tasksRouter = require('./routes/tasks')
const cors = require('cors');



//CREAR EL SERVIDOR DE EXPRESS
const app = express();

//BASE DE DATOS
dbConnection()

//CORS
// const corsOptions = {
//     origin: 'https://just-to-do-it.vercel.app/',
//     optionsSuccessStatus: 200 
// }
app.use( cors() ) //Middleware //para que el servidor acepte peticiones de otros dominios

//DIRECTORIO PUBLICO
app.use( express.static('public') ) //middleware //para que express entienda los archivos estaticos que se envian en el body

//LECTURA Y PARSEO DEL BODY
app.use( express.json() ); //middleware //para que express entienda los json que se envian en el body

//RUTAS

app.use('/api/auth', authRouter ); //middleware //rutas de auth 
app.use('/api/tasks', tasksRouter ) //middleware rutas de las tasks


//TODO: auth // crear, login, renew
//TODO: CRUD: Tareas


//ESCUCHAR PETICIONES

app.listen( process.env.PORT, () => {
    console.log(`Servidor funcionando en el puerto ${process.env.PORT}`);
})