import userModel from "../model/user.model.js";
import httpError from "../middleware/httpError.js";

const add = async (req,res,next) => {
    try 
    {
        const {name,email,password} = req.body;

        const newUser = new userModel({name,email,password});

        await newUser.save();

        res.status(200).json({success:true,message:"User Added Successfully", newUser});
    } 
    catch (error) 
    {
        return next(new httpError(error.message,500));
    }
}

const getAllUser = async (req, res, next) => {
  try {
    const users = await userModel.find();

    if (users.length === 0) 
    {
      return next(new httpError("no user data found", 404));
    }

    res.status(200).json({
      success: true,
      message: "all user data fetched successfully",
      users,
    });

  } catch (error) {
    return next(new httpError(error.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findByCredential(email, password);

    if (!user) {
      return next(new httpError("Unable to login", 400));
    }

    const token = await user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    return next(new httpError(error.message, 500));
  }
};

const authLogin = async (req, res, next) => {
  try 
  {
    const user = req.user;

    res
      .status(200)
      .json({ success: true, message: "auth login successfully", user });
  } 
  
  catch (error) 
  {
    return next(new httpError(error.message, 500));
  }
};

const deleteUser = async (req, res, next) => {
  try 
  {
    const user = req.user;

    await userModel.deleteOne(user);

    res
      .status(200)
      .json({ success: true, message: "user deleted successfully" });
  } 
  
  catch (error) 
  {
    return next(new httpError(error.message, 500));
  }
};


const updateUser = async (req, res, next) => {
  try 
  {
    const user = req.user;

    const updates = Object.keys(req.body);

    const allowedField = ["name", "password"];

    const isValidUpdates = updates.every((field) =>
      allowedField.includes(field),
    );

    if (!isValidUpdates) 
    {
      return next(new httpError("only allowed field can be update", 400));
    }

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "user data updated successfully", user });
  } 
  
  catch (error) 
  {
    return next(new httpError(error.message, 500));
  }
};

const logOut = async (req, res, next) => {
  try 
  {
    req.user.tokens = req.user.tokens.filter((t) => t.token != req.token);

    await req.user.save();

    res
      .status(200)
      .json({ success: true, message: "LogOut Successfully" });
  } 
  
  catch (error) 
  {
    return next(new httpError(error.message, 500));
  }
};

const logOutAll = async (req, res, next) => {
  try 
  {
    req.user.tokens = [];

    await req.user.save();

    res
      .status(200)
      .json({ success: true, message: "LogOut From All Devices" });
  } 
  
  catch (error) 
  {
    return next(new httpError(error.message, 500));
  }
};



export default {add,getAllUser,login,authLogin,deleteUser,updateUser,logOut,logOutAll}

