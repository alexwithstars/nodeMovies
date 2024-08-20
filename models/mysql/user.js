import crypto from 'node:crypto'
import { encryptStr, getDictionary, decryptStr } from '../../utils/encrypt.js'
import { createClient } from '@libsql/client'

const connection = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
})

export class UserModel {
  static async getAll () {
    try {
      const { rows } = await connection.execute('select username from user')
      return rows.map(entrie => entrie.username)
    } catch { return false }
  }

  static async verifyKey ({ input }) {
    const { logkey, username } = input
    const basekey = getDictionary(logkey)
    try {
      const { rows: [user] } = await connection.execute({
        sql: 'select logkey from user where logkey=? and username=?',
        args: [encryptStr(basekey, logkey), username]
      })
      if (user) return user
      return false
    } catch { return false }
  }

  static async login ({ input }) {
    const { username, password } = input
    const base = getDictionary(username + password)
    try {
      const { rows: [user] } = await connection.execute({
        sql: 'select id,email,password,username from user where username=? and password=?',
        args: [username, encryptStr(base, password)]
      })
      if (user) {
        user.email = decryptStr(base, user.email)
        const basekey = getDictionary(password + user.password)
        user.logkey = encryptStr(basekey, user.password)
        user.password = password
        return user
      }
      return false
    } catch { return false }
  }

  static async signup ({ input }) {
    const newUser = {
      id: crypto.randomUUID(),
      ...input
    }
    const base = getDictionary(newUser.username + newUser.password)
    const email = getDictionary(newUser.email)
    const { password } = newUser
    newUser.password = encryptStr(base, newUser.password)
    const firstKey = getDictionary(password + newUser.password)
    const publickey = encryptStr(firstKey, newUser.password)
    const secondKey = getDictionary(publickey)
    newUser.logkey = encryptStr(secondKey, publickey)
    newUser.recover = encryptStr(email, newUser.email)
    newUser.email = encryptStr(base, newUser.email)
    try {
      const { rows: [check] } = await connection.execute({
        sql: 'select * from user where username=? or recover=?',
        args: [newUser.username, newUser.recover]
      })
      if (check) return null
      await connection.execute({
        sql: 'insert into user(id,username,password,logkey,email,recover) values (?,?,?,?,?,?)',
        args: [newUser.id, newUser.username, newUser.password, newUser.logkey, newUser.email, newUser.recover]
      })
      return newUser
    } catch (e) {
      console.log(e)
      return false
    }
  }

  static async delete ({ input }) {
    const { username, password } = input
    const base = getDictionary(username + password)
    try {
      const { rows: [user] } = await connection.execute({
        sql: 'select id,email from user where username=? and password=?',
        args: [username, encryptStr(base, password)]
      })
      if (!user) return false
      await connection.execute({
        sql: 'delete from user where username=? and password=?',
        args: [username, encryptStr(base, password)]
      })
      return username
    } catch { return false }
  }

  static async update ({ input }) {
    const { username, password } = input
    const base = getDictionary(username + password)
    try {
      const { rows: [user] } = await connection.execute({
        sql: 'select id,email from user where username=? and password=?',
        args: [username, encryptStr(base, password)]
      })
      if (!user) return false
      await connection.query({
        sql: 'delete from user where username=? and password=?',
        args: [username, encryptStr(base, password)]
      })
      return username
    } catch { return false }
  }
}
