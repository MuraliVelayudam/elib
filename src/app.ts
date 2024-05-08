import express from 'express'
import globalErrorHandling from './middlewares/globalErrorHandling'
import userRouter from './user/userRouter/userRouter'

const app = express()
app.use(express.json())

app.use('/api/users/', userRouter)

app.use(globalErrorHandling)

export default app
