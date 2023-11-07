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
	app.listen(PORT,()=>{
		console.log(`listening on port ${PORT}`)
	})
}

import {MovieModel} from "./models/local/movie.js"
createApp({movieModel:MovieModel})