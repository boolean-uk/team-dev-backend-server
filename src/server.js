import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import userRouter from './routes/user.js'
import postRouter from './routes/post.js'
import authRouter from './routes/auth.js'
import cohortRouter from './routes/cohort.js'
import deliveryLogRouter from './routes/deliveryLog.js'
import unitsRouter from './routes/units.js'
import courseRouter from './routes/course.js'
import moduleRouter from './routes/module.js'

const app = express()

app.disable('x-powered-by')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/units', unitsRouter)
app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use('/cohorts', cohortRouter)
app.use('/logs', deliveryLogRouter)
app.use('/courses', courseRouter)
app.use('/modules', moduleRouter)
app.use('/', authRouter)

app.get('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    data: {
      resource: 'Not found'
    }
  })
})

export default app
