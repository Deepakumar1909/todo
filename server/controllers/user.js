const bcrypt=require("bcryptjs")
const User=require("../models/user")
const jwt=require("jsonwebtoken")
const authenticateToken=require("../middlewares/user")

const signup=async(req, res)=>{
    const receivedUser=req.body;
    console.log(receivedUser);
    
    const hashedPassword=await bcrypt.hash(receivedUser.password, 8)
    try {
        const emailExist=await User.findOne({"email": receivedUser.email})
        if(emailExist){
            return res.status(409).json({"message": "email already exists"})
        }

        const newUser=new User({
            ...receivedUser,
            password: hashedPassword,
        })
    
        const createUser=await newUser.save();

        // console.log(process.env.JWT_SECRET)
        
        const authToken=jwt.sign({email:receivedUser.email, username: receivedUser.username, _id: createUser._id}, process.env.JWT_SECRET)

        return res.json({"message": "signup successful", "token": authToken});

    } catch (error) {
        console.error(error);
        return res.status(500).json({"message": `error during signup: ${error.message}`});
    }
}

const login = async (req, res)=> {
    const receivedUser=req.body;
    try {
        const userExist = await User.findOne( {"email": receivedUser.email});
        if (userExist) {
            const validPassword = await bcrypt.compare(receivedUser.password, userExist.password);
            if (validPassword) {
                console.log(userExist._id)
                // console.log(process.env.JWT_SECRET)
                const authToken=jwt.sign({email:userExist.email, username:userExist.username, _id: userExist._id}, process.env.JWT_SECRET)
                return res.json({"message": "You have signed in successfully", "token": authToken});
            } else {
                res.json({"message": "Email or password didn't match"});
            }
        } else {
            res.json({"message": "Email or password didn't match"});
        }
    } catch (error) {
        console.log(error);
        res.json({"message": `Error occurred during signin: ${error}`});
    }
}

module.exports = { signup, login };