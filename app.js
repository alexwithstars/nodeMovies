// imports ----------
import express  from "express"
import {createMovieRouter} from "./routes/movies.js"
import {viewRouter} from "./routes/view.js"


export function createApp({movieModel}){
	// init ----------
	const app=express()
	app.disable("x-powered-by")
	app.use(express.json())

	// movies ----------
	app.use("/movies",createMovieRouter({movieModel}))

	// view ----------
	app.use("/view",viewRouter)

	// Errors ----------
	app.use((req,res)=>{
		res.status(404).json({error: "Resource not found"})
	})
	app.use((err,req,res,next)=>{
		res.json({error:err})
	})

	// listen ----------
	const PORT = process.env.PORT ?? 3000
	const IP = process.env.IP ?? "127.0.0.1"
	app.listen(PORT,IP,()=>{
		console.log(`listening on http://${IP}:${PORT}`)
	})
}

import {MovieModel} from "./models/mysql/movie.js"
createApp({movieModel:MovieModel})