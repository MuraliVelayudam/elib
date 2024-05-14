import express from 'express'
import globalErrorHandling from './middlewares/globalErrorHandling'
import userRouter from './user/userRouter/userRouter'
import bookRouter from './book/bookRouter/bookRouter'
import cors from 'cors'
import { config } from './config/config'

const app = express()
app.use(express.json())
app.use(
    cors({
        origin: config.frontendDomin,
    })
)

app.use('/api/users/', userRouter)
app.use('/api/books', bookRouter)

app.use(globalErrorHandling)

export default app
