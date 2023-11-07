import crypto  from "node:crypto"
import {readJSON} from "../../utils.mjs"
const movies = readJSON("./data/movies.json")

export class MovieModel{
	static async getAll({genre}){
		if(genre){
			return movies.filter(
				movie=> movie.genre.some(gen => gen.toLowerCase() === genre.toLowerCase())
			)
		}
		return movies
	}
	static async getById({id}){
		const movie = movies.find(movie => movie.id === id)
		return movie
	}
	static async getGenres(){
		return [...new Set(movies.flatMap(entrie=>entrie.genre))]
	}
	static async create({input}){
		const newMovie = {
			id:crypto.randomUUID(),
			...input
		}
		movies.push(newMovie)
		return newMovie
	}
	static async delete({id}){
		const index = movies.findIndex(movie => movie.id === id)
		if(index == -1) return false
		const {title} = movies[index]
		movies.splice(index,1)
		return title
	}
	static async update({id,input}){
		const index = movies.findIndex(movie => movie.id === id)
		if(index == -1) return false
		movies[index] = {
			...movies[index],
			...input
		}
		return movies[index]
	}
}
