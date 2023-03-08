const { Schema, model } = require("mongoose");

const taskSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true
    },
    done:{
        type: Boolean,
        required: true
    },
    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

});

taskSchema.method('toJSON', function() {
    const { __v, _id, ...object} = this.toObject();
    object.id = _id
    return object;
})

module.exports = model('Task', taskSchema);