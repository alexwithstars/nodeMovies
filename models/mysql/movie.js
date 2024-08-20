import crypto from 'node:crypto'
import { createClient } from '@libsql/client'

const connection = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
})

// funcion para obtener los generos de una pelicula
async function setGenres (movie) {
  const { rows: genres } = await connection.execute({
    sql: 'select name from movie_genre join genre on id=genre_id where movie_id=?',
    args: [movie.id]
  })

  // los generos se pasan al formato requerido
  movie.genre = [...genres.map(entrie => {
    return entrie.name
  })]
  return movie
}

export class MovieModel {
  static async getAll ({ genre }) {
    if (!genre) {
      const { rows: result } = await connection.execute('select * from movie')
      for (const movieIndex in result) {
        result[movieIndex] = await setGenres(result[movieIndex])
      }
      return result
    }
    const { rows: movies } = await connection.execute({
      sql: 'select movie_id from movie_genre where genre_id=(select id from genre where name=?)',
      args: [genre]
    })
    const response = []
    // para cada pelicula obtenemos los generos
    for (const entrie of movies) {
      try {
        let { rows: [movie] } = await connection.execute({
          sql: 'select * from movie where id=?',
          args: [entrie.movie_id]
        })
        movie = await setGenres(movie)
        response.push(movie)
      } catch (e) {
        console.error(e)
        return false
      }
    }
    return response
  }

  static async getById ({ id }) {
    let { rows: [movie] } = await connection.execute({
      sql: 'select * from movie where id=?',
      args: [id]
    })
    if (!movie) {
      return false
    }
    movie = await setGenres(movie)
    return movie
  }

  static async getGenres () {
    const { rows: genres } = await connection.execute('select name from genre')
    if (genres) {
      return genres.flatMap(entrie => entrie.name)
    }
    return false
  }

  static async create ({ input }) {
    const newMovie = {
      id: crypto.randomUUID(),
      ...input
    }
    await connection.execute({
      sql: 'insert into movie(id,title,year,director,duration,poster,rate) values (?,?,?,?,?,?,?)',
      args: [newMovie.id, newMovie.title, newMovie.year, newMovie.director, newMovie.duration, newMovie.poster, newMovie.rate]
    })
    for (const gen of newMovie.genre) {
      await connection.execute({
        sql: 'insert into movie_genre (movie_id,genre_id) values (?,(select id from genre where name=?))',
        args: [newMovie.id, gen]
      })
    }
    return newMovie
  }

  static async delete ({ id }) {
    try {
      const { rows: [{ title }] } = await connection.execute('select title from movie where id=?', [id])
      await connection.execute({
        sql: 'delete from movie_genre where movie_id=?',
        args: [id]
      })
      await connection.execute({
        sql: 'delete from movie where id=?',
        args: [id]
      })
      return title
    } catch { return false }
  }

  static async update ({ id, input }) {
    let updateKeys = []
    const values = []
    for (const [key, value] of Object.entries(input)) {
      if (key === 'genre') continue
      updateKeys.push(`${key}=?`)
      values.push(value)
    }
    // creamos la queryString segun los datos modificados
    updateKeys = `update movie set ${updateKeys.join(',')} where id=?`
    const curMovie = await this.getById({ id })
    // actualizamos los generos
    if (input.genre) {
      if (!curMovie) {
        return false
      }
      for (const genre of curMovie.genre) {
        if (!input.genre.includes(genre)) {
          const { rows: [{ id: genreId }] } = await connection.execute({
            sql: 'select id from genre where name=?',
            args: [genre]
          })
          await connection.execute({
            sql: 'delete from movie_genre where movie_id=? and genre_id=?',
            args: [id, genreId]
          })
        }
      }
      for (const genre of input.genre) {
        if (!curMovie.genre.includes(genre)) {
          const { rows } = await connection.execute({
            sql: 'select id from genre where name like ?',
            args: [genre]
          })
          console.log('hello: ', input.genre, genre, rows)
          const { id: genreId } = rows[0]
          await connection.execute({
            sql: 'insert into movie_genre(movie_id,genre_id) values (?,?)',
            args: [id, genreId]
          })
        }
      }
    }
    // actualizamos la pelicula
    await connection.execute({
      sql: updateKeys,
      args: [...values, id]
    })
    return { ...curMovie, ...input }
  }
}
