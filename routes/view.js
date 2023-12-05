import {Router} from "express"
import {viewController} from "../controllers/view.js"

export const viewRouter=Router()

// get ----------
viewRouter.get(	"/:page$",viewController.getPage)
viewRouter.get("*",viewController.getResource)
viewRouter.get("*",viewController.error)