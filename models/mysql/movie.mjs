import crypto  from "node:crypto"
import mysql from "mysql2/promise"

const config = process.env.CON_STRING ?? {
	host:"localhost",
	port:3306,
	user:"root",
	password:process.env.PASSWORD ?? "13254600",
	database:"moviesdb"
}
const connection = await mysql.createConnection(config)

// funcion para obtener los generos de una pelicula
async function setGenres(movie){
	const [genres] = await connection.query(`select name from movie_genre 
	join genre on id=genre_id where movie_id=?`,[movie.id])

	// los generos se pasan al formato requerido
	movie.genre=[...genres.map(entrie=>{
		return entrie.name
	})]
	return movie
}

export class MovieModel{
	static async getAll({genre}){
		if(!genre){
			let [result] = await connection.query("select * from movie")
			for(let movieIndex in result){
				result[movieIndex]=await setGenres(result[movieIndex])
			}
			return result
		}
		const [movies] = await connection.query(`select movie_id from movie_genre
		 where genre_id=(select id from genre where name=?)`,[genre])
		let response=[]
		// para cada pelicula obtenemos los generos
		for(let entrie of movies){
			try{
				let [[movie]] = await connection.query(`select * from movie where id=?`,
				[entrie.movie_id])
				movie=await setGenres(movie)
				response.push(movie)
			}catch(e){
				console.error(e)
				return false
			}
		}
		return response
	}
	static async getById({id}){
		let [[movie]] = await connection.query("select * from movie where id=?",[id])
		if(!movie){
			return false
		}
		movie=await setGenres(movie)
		return movie
	}
	static async getGenres(){
		const [genres]=await connection.query("select name from genre")
		if(genres){
			return genres.flatMap(entrie=>entrie.name)
		}
		return false
	}
	static async create({input}){
		const newMovie = {
			id:crypto.randomUUID(),
			...input
		}
		await connection.query(`insert into movie(id,title,year,director,duration,poster,rate)
		values (?,?,?,?,?,?,?)`,[newMovie.id,newMovie.title,newMovie.year,newMovie.director,
		newMovie.duration,newMovie.poster,newMovie.rate])
		for(let gen of newMovie.genre){
			await connection.query(`insert into movie_genre (movie_id,genre_id)
			values (?,(select id from genre where name=?))`,[newMovie.id,gen])
		}
		return newMovie
	}
	static async delete({id}){
		try{
			const [[{title}]]=await connection.query(`select title from movie where id=?`,[id])
			await connection.query(`delete from movie_genre where movie_id=?`,[id])
			await connection.query(`delete from movie where id=?`,[id])
			return title
		} catch { return false }
	}
	static async update({id,input}){
		let updateKeys=[]
		let values=[]
		for(const [key,value] of Object.entries(input)){
			if(key=="genre") continue
			updateKeys.push(`${key}=?`)
			values.push(value)
		}
		// creamos la queryString segun los datos modificados
		updateKeys=`update movie set ${updateKeys.join(",")} where id=?`
		const curMovie = await this.getById({id})
		// actualizamos los generos
		if(input.genre){
			if(!curMovie){
				return false
			}
			for(const genre of curMovie.genre){
				if(!input.genre.includes(genre)){
					await connection.query(`delete from movie_genre 
					where movie_id=? and genre_id=(select id from genre 
					where name=?)`,[id,genre])
				}
			}
			for(const genre of input.genre){
				if(!curMovie.genre.includes(genre)){
					await connection.query(`insert into movie_genre(movie_id,genre_id)
					values (?,(select id from genre where name=?))`,[id,genre])
				}
			}
		}
		// actualizamos la pelicula
		await connection.query(updateKeys,[...values,id])
		return {...curMovie,...input}
	}
}
