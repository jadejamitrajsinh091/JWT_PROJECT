import userController from "../controller/user.controller.js";
import auth from "../middleware/auth.js";
import httpError from "../middleware/httpError.js";
import express from "express"

const router = express.Router();

router.post("/add",userController.add);

router.get("/getAllUser",userController.getAllUser);

router.post("/login",userController.login);

router.post("/authLogin",auth,userController.authLogin);

router.delete("/delete",auth,userController.deleteUser);

router.patch("/update",auth,userController.updateUser);

router.get("/logOut",auth,userController.logOut);


export default router;