import {Router} from "express"
import {UserController} from "../controllers/users.js"


export function createUserRouter({userModel}){
	const usersRouter = Router()
	const userController = new UserController({userModel})

	// get ----------
	usersRouter.get("/",userController.getAll)

	// post ----------
	usersRouter.post("/signup",userController.signup)
	usersRouter.post("/login",userController.login)
	usersRouter.post("/remove",userController.delete)
	usersRouter.post("/check",userController.verifyKey)

	// patch ----------
	usersRouter.patch("/update",userController.update)

	return usersRouter
}
