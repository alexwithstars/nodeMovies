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
	const request = await fetch("http://localhost:3000/users")
	const users = await request.json()
	for(const input of users){
		const newUser = {
			// id:crypto.randomUUID(),
			...input
		}
		await connection.query(`insert into user(id,title,year,director,duration,poster,rate)
		values (?,?,?,?,?,?,?)`,[newUser.id,newUser.title,newUser.year,newUser.director,
		newUser.duration,newUser.poster,newUser.rate])
		for(let gen of newUser.genre){
			await connection.query(`insert into user_genre (user_id,genre_id)
			values (?,(select id from genre where name=?))`,[newUser.id,gen])
		}
	}
}
createApp()