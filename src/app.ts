import express from 'express'
import globalErrorHandling from './middlewares/globalErrorHandling'
import userRouter from './user/userRouter/userRouter'
import bookRouter from './book/bookRouter/bookRouter'

const app = express()
app.use(express.json())

app.use('/api/users/', userRouter)
app.use('/api/books', bookRouter)

app.use(globalErrorHandling)

export default app
