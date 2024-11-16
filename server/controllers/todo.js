// const Todo=require("../models/todo")

// const settodo=async(req, res)=>{
//     const receivedtodo=req.body;
//     console.log(receivedtodo);
    
//     try {

//         const newtodo=new Todo({
//             ...receivedtodo,
//         })
    
//         const createtodo=await newtodo.save();

//         return res.json({"message": "todo created"});

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({"message": `error during settodo: ${error.message}`});
//     }
// }

// const gettodo=async(req, res)=>{
//     const {email}=req.body;
//     try {
        
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({"message": `error during gettodo: ${error.message}`});
//     }
// }

// module.exports = { gettodo, settodo };



const Todo = require("../models/todo");
const User = require("../models/user");

// Create new todo
const settodo = async (req, res) => {
    const { title, description, duedate, status } = req.body;
    const userId = req.user._id; // Assuming you attach the user ID to req.user after JWT authentication

    // const descriptionExist=await Todo.findOne({"description": req.body.description})
    // if(descriptionExist){
    //     return res.status(207).json({"message":"description already exist"})
    // }

    try {
        const newTodo = new Todo({
            title,
            description,
            duedate,
            status,
            user: userId,
        });

        await newTodo.save();
        return res.json({ message: "Todo created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Error during settodo: ${error.message}` });
    }
};

// Get todos for a specific user
const gettodo = async (req, res) => {
    const userId = req.user._id; // Assuming JWT middleware sets req.user

    try {
        const todos = await Todo.find({ user: userId });
        return res.json({ todos });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Error during gettodo: ${error.message}` });
    }
};

// Update Todo
const updatetodo = async (req, res) => {
    const { id, title, description, duedate, status } = req.body;
    const userId = req.user._id; // Assuming JWT middleware sets req.user

    try {
        const todo = await Todo.findOne({ _id: id, user: userId });

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        // Update the fields
        todo.title = title || todo.title;
        todo.description = description || todo.description;
        todo.duedate = duedate || todo.duedate;
        todo.status = status || todo.status;

        await todo.save();

        return res.json({ message: "Todo updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Error during updatetodo: ${error.message}` });
    }
};



// Delete Todo
const deletetodo = async (req, res) => {
    const { id } = req.body;
    const userId = req.user._id; // Assuming JWT middleware sets req.user

    try {
        const todo = await Todo.findOne({ _id: id, user: userId });

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        await todo.deleteOne();

        return res.json({ message: "Todo deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Error during deletetodo: ${error.message}` });
    }
};


module.exports = { gettodo, settodo, updatetodo, deletetodo };
