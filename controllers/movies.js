import {validateMovie,partialValidateMovie}  from "../schemas/movies.js"

export class MovieController{
	constructor({movieModel}){
		this.movieModel=movieModel
	}
	async cors(req,res,next){
		res.header("Access-Control-Allow-Origin","*")
		res.header("Access-Control-Allow-Methods","*")
		next()
	}
	getAll = async (req,res) => {
		const {genre} = req.query
		const movies = await this.movieModel.getAll({genre})
		if(movies) return res.json(movies)
		next()
	}
	getById = async (req,res,next) => {
		const {id} = req.params
		const movie =await this.movieModel.getById({id})
		if(movie) return res.json(movie)
		res.status(404)
	next("Movie not found")
}
getGenres = async (req,res,next) => {
		res.json(await this.movieModel.getGenres())
	}
	create = async (req,res,next) => {
		const movie = validateMovie(req.body)
		if(movie.error){
			res.status(400)
			return next(movie.error.issues)
		}
		const response = await this.movieModel.create({input:movie.data})
		res.status(201).json(response)
	}
	delete = async (req,res,next) => {
		const {id} = req.params
		const stat = await this.movieModel.delete({id})
		if(!stat){
			res.status(404)
			return next("Movie not found")
		}
		const response = {message:`Movie ${stat} deleted`}
		res.json(response)
	}
	update = async (req,res,next) => {
		const newData = partialValidateMovie(req.body)
		if(newData.error){
			res.status(400)
			return next(newData.error.issues)
		}
		const {id} = req.params
		const response = await this.movieModel.update({id,input:newData.data})
		if(!response){
			res.status(404)
			return next("Movie not found")
		}
		res.json(response)
	}
}