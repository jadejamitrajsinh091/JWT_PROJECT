import jwt from "jsonwebtoken";
import httpError from "./httpError.js";
import User from "../model/user.model.js"




const auth = async(req,res,next)=>{

    try {

        const authHeader = await req.header("Authorization");

        if(!authHeader)
        {
            return next(new httpError("auth header is required",404));
        }

        const token = authHeader.replace("Bearer ","")

        const decode = jwt.verify(token,process.env.JWT_SECRET);

        if(!decode)
        {
            return next(new httpError("failed verify token",400))
        }

        const user = await User.findOne({_id:decode._id,"tokens.token":token,});


        if(!user)
        {
            return next(new httpError("unauthorize access",401))
        }

        console.log("user",user)

        req.user = user;
        req.token = token;

        next();
        
    } 
    catch (error)
    {
      next(new httpError(error.message))

    }

}

export default auth;