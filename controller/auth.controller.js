import user from "../schemas/User.schema.js";

export const register = async (req,res)=>{
    try {
        console.log('====================================');
        console.log(req.body);
        console.log('====================================');
       const {email,password,name} = req.body

       if(!email || !password || !name){
        return res.status(400).json({message:"all fields are required"})
       }

        const userExist = await user.findOne({email})
        if(userExist){
            return res.status(400).json({message:"user already exist"})
        }

        const userCreated = await user.create({email,password,name})
        if(!userCreated){
            return res.status(400).json({message:"user not created"})
        }

        res.status(201).json({message:"user created successfully"})
    } catch (error) {
        
        console.error(error)
    }
}