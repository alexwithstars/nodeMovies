// imports ----------
import express from 'express'
import { createMovieRouter } from './routes/movies.js'
import { createUserRouter } from './routes/users.js'
import { viewRouter } from './routes/view.js'
import { cors } from './middlewares/cors.js'
import 'dotenv/config'

import { MovieModel } from './models/mysql/movie.js'
import { UserModel } from './models/mysql/user.js'

export function createApp ({ movieModel, userModel }) {
  // init ----------
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json())

  // cors ----------
  app.use(cors)

  // movies ----------
  app.use('/movies', createMovieRouter({ movieModel }))
  app.use('/users', createUserRouter({ userModel }))

  // view ----------
  app.use('/view', viewRouter)
  app.get('/', (req, res) => {
    res.redirect('/view/home')
  })

  // Errors ----------
  app.use((req, res) => {
    res.status(404).json({ error: 'Resource not found' })
  })
  app.use((err, req, res, next) => {
    res.json({ error: err })
  })

  // listen ----------
  const PORT = process.env.PORT ?? 3000
  app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
  })

  return app
}
export default createApp({ movieModel: MovieModel, userModel: UserModel })
