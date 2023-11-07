import {Router} from "express"
import {viewController} from "../controllers/view.js"

export const viewRouter=Router()

// cors ----------
viewRouter.use(viewController.cors)

// get ----------
viewRouter.get(	"/:page$",viewController.getPage)
viewRouter.get("*",viewController.getResource)
viewRouter.get("*",viewController.error)