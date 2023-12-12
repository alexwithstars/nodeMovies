import crypto  from "node:crypto"
import mysql from "mysql2/promise"
import {encryptStr,getDictionary,decryptStr} from "../../utils/encrypt.js"

const config = process.env.DATABASE ?? {
	host:"localhost",
	port:3306,
	user:"root",
	password:"",
	database:"usersdb"
}
const connection = await mysql.createConnection(config)

const chr = n=>String.fromCodePoint(n)
const ord = n=>n.codePointAt(0)

export class UserModel{
	static async getAll(){
		try{
			const [response] = await connection.query(`select username from user`)
			 return response.map(entrie=>entrie.username)
		} catch { return false }
	}
	static async verify({input}){
		const {username,password}=input
		const base = getDictionary(username+password)
		try{
			const [[user]] = await connection.query(`select id,email from user
			where username=? and password=?`,[username,encryptStr(base,password)])
			if(user){
				user.email=decryptStr(base,user.email)
				user.password=password
				user.username=username
				return user
			}
			return false
		} catch { return false }
	}
	static async create({input}){
		const newUser = {
			id:crypto.randomUUID(),
			...input
		}
		const base=getDictionary(newUser.username+newUser.password)
		const email=getDictionary(newUser.email)
		newUser.recover=encryptStr(email,newUser.email)
		newUser.password=encryptStr(base,newUser.password)
		newUser.email=encryptStr(base,newUser.email)
		try{
			const [[check]] = await connection.query(`select * from user 
			where username=? or recover=?`,[newUser.username,newUser.recover])
			if(check) return null
			await connection.query(`insert into user(id,username,password,email,recover)
			values (?,?,?,?,?)`,[newUser.id,newUser.username,newUser.password,newUser.email,
			newUser.recover])
			return newUser
		} catch(e) { return false }
	}
	static async delete({input}){
		const {username,password}=input
		const base = getDictionary(username+password)
		try{
			const [[user]] = await connection.query(`select id,email from user
			where username=? and password=?`,[username,encryptStr(base,password)])
			if(!user) return false
			await connection.query(`delete from user
			where username=? and password=?`,[username,encryptStr(base,password)])
			return username
		} catch {return false }
	}
	static async update({input}){
		const {username,password}=input
		const base = getDictionary(username+password)
		try{
			const [[user]] = await connection.query(`select id,email from user
			where username=? and password=?`,[username,encryptStr(base,password)])
			if(!user) return false
			await connection.query(`delete from user
			where username=? and password=?`,[username,encryptStr(base,password)])
			return username
		} catch {return false }
	}
}
