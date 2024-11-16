const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    duedate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "to-do"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    }
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
