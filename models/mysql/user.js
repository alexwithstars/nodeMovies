import crypto  from "node:crypto"
import mysql from "mysql2/promise"
import {encryptStr,getDictionary,decryptStr} from "../../utils/encrypt.js"

const config = process.env.DATABASE ?? {
	host:"localhost",
	port:3306,
	user:"root",
	password:"",
	database:"moviesdb"
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
	static async verifyKey({input}){
		const {logkey,username}=input
		const basekey = getDictionary(logkey)
		try{
			const [[user]] = await connection.query(`select logkey from user
			where logkey=? and username=?`,[encryptStr(basekey,logkey),username])
			if(user) return user
			return false
		} catch { return false }
	}
	static async login({input}){
		const {username,password}=input
		const base = getDictionary(username+password)
		try{
			const [[user]] = await connection.query(`select id,email,password,username from user
			where username=? and password=?`,[username,encryptStr(base,password)])
			if(user){
				user.email=decryptStr(base,user.email)
				const basekey=getDictionary(password+user.password)
				user.logkey=encryptStr(basekey,user.password)
				user.password=password
				return user
			}
			return false
		} catch { return false }
	}
	static async signup({input}){
		const newUser = {
			id:crypto.randomUUID(),
			...input
		}
		const base=getDictionary(newUser.username+newUser.password)
		const email=getDictionary(newUser.email)
		const {password}=newUser
		newUser.password=encryptStr(base,newUser.password)
		const firstKey=getDictionary(password+newUser.password)
		const publickey=encryptStr(firstKey,newUser.password)
		const secondKey=getDictionary(publickey)
		newUser.logkey=encryptStr(secondKey,publickey)
		newUser.recover=encryptStr(email,newUser.email)
		newUser.email=encryptStr(base,newUser.email)
		try{
			const [[check]] = await connection.query(`select * from user 
			where username=? or recover=?`,[newUser.username,newUser.recover])
			if(check) return null
			await connection.query(`insert into user(id,username,password,logkey,email,recover)
			values (?,?,?,?,?,?)`,[newUser.id,newUser.username,newUser.password,newUser.logkey,newUser.email,
			newUser.recover])
			return newUser
		} catch { return false }
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
