import {Router} from "express"
import {UserController} from "../controllers/users.js"


export function createUserRouter({userModel}){
	const usersRouter = Router()
	const userController = new UserController({userModel})

	// get ----------
	usersRouter.get("/",userController.getAll)

	// post ----------
	usersRouter.post("/signup",userController.create)
	usersRouter.post("/login",userController.verify)
	usersRouter.post("/remove",userController.delete)

	// patch ----------
	usersRouter.patch("/update",userController.update)

	return usersRouter
}
