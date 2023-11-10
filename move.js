// imports ----------
import express  from "express"
import mysql from "mysql2/promise"


async function createApp(){
	// init ----------
	const app=express()
	app.disable("x-powered-by")
	app.use(express.json())

	// listen ----------
	const PORT = process.env.PORT ?? 3001
	const server = app.listen(PORT,()=>{
		const addres = server.address()
		console.log(`listening on http://${(addres.address=="::" ? "localhost":addres.address)}:${PORT}`)
	})
	const connection = await mysql.createConnection('mysql://hky05zjwa4e9laer6rhe:pscale_pw_XanRGaDcF6aRnEHFIouscLCmPrILPc3xDWIXa55vBKH@aws.connect.psdb.cloud/moviesdb?ssl={"rejectUnauthorized":true}')
	const genres = [
		"Drama",
		"Action",
		"Crime",
		"Adventure",
		"Sci-Fi",
		"Romance",
		"Animation",
		"Biography",
		"Fantasy",
		"Comedy",
		"Horror",
		"Thriller"
	]
	for(const gen of genres){
		await connection.query(`insert into genre(name)
		values (?)`,[gen])
	}
	const request = await fetch("http://localhost:3000/movies")
	const movies = await request.json()
	for(const input of movies){
		const newMovie = {
			// id:crypto.randomUUID(),
			...input
		}
		await connection.query(`insert into movie(id,title,year,director,duration,poster,rate)
		values (?,?,?,?,?,?,?)`,[newMovie.id,newMovie.title,newMovie.year,newMovie.director,
		newMovie.duration,newMovie.poster,newMovie.rate])
		for(let gen of newMovie.genre){
			await connection.query(`insert into movie_genre (movie_id,genre_id)
			values (?,(select id from genre where name=?))`,[newMovie.id,gen])
		}
	}
}
createApp()