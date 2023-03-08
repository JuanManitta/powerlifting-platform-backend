const { response } = require('express');
const Task = require('../models/Task');

const getTasks = async(req, resp = response) => {
    const userUid = req.uid  //Ese req.uid viene del validator JWT

    const tasks = await Task.find({user: userUid}).populate('user', 'name')                            
    resp.json({
        ok:true,
        tasks,
    })
};


const createTask = async(req, resp = response) => {

    
    try {
        
        const task = new Task(req.body)    
        task.user = req.uid

        const taskSaved = await task.save()

        resp.json({
            ok: true,
            task: taskSaved
        })
        
    } catch (error) {
        console.log(error)
        resp.status(500).json({
            ok:false,
            msg: 'Talk with the administrator'
        })
        
    }

};


const editTask = async(req, resp = response) => {

    const taskId = req.params.id;  // Params es para tomar el Id que viene en la URL
    const uid = req.uid  //UID del usuario que posee la nota que estoy queriendo editar

    try {
        const task = await Task.findById(taskId);

        if( !task ){
            return resp.status(404).json({  //VALIDACION 1
                ok:false,
                msg: 'Task doesnt exist'
            });
        };
        if(task.user.toString() !== uid) { 
            return resp.status(401).json({
                ok: false,
                msg: 'You cannot edit this task'
            })
        }

        const newTask = { //LA NUEVA TAREA QUE VOY A COLOAR ENVIADA EN LA PETICION
            ...req.body,
            user: uid
        }

        const taskUpdated = await Task.findByIdAndUpdate( taskId, newTask, {  //EDITO LA TAREA Y LA RECIBO PARA POSTEARLA
            new: true
        });

        resp.json({
            ok:true,
            task: taskUpdated
        })
        
    } catch (error) {
        console.log(error);
        resp.status(500).json()({
            ok: false,
            msg: 'talk with the administrator'
        });  
    };
};


const deleteTask = async(req, resp = response) => {

    const taskId = req.params.id; //OBTENER ID ENVIADO EN LA URL
    const uid = req.uid; //OBTENER UID EXTRAIDO DEL TOKETN (VER VALIDATE JWT)

    try {
        const task = await Task.findById(taskId);

        //VALIDACION 1
        if(!task) {
            return resp.status(404).json({
                ok:false,
                msg:'Task doesnt exist'
            })
        }
        //VALIDACION 2
        if(task.user.toString() !== uid){
            return resp.status(401).json({
                ok:false,
                msg: 'You cannot delte this task'
            });
        }

        await Task.findByIdAndDelete(taskId);

        resp.json({ ok:true });
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'talk with the administrator'
        });
    }
};



module.exports ={
    getTasks,
    createTask,
    editTask,
    deleteTask
}