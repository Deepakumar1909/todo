const { updatetodo } = require("../controllers/todo");
const { deletetodo } = require("../controllers/todo");
const {gettodo, settodo}=require("../controllers/todo")
const express=require("express")

const router=express.Router();

router.route("/gettodo").get(gettodo)
router.route("/settodo").post(settodo)
router.route("/updatetodo").post(updatetodo)
router.route("/deletetodo").post(deletetodo)

module.exports=router