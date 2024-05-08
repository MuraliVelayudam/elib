import express from 'express'
import globalErrorHandling from './middlewares/globalErrorHandling'

const app = express()
app.use(express.json())

app.use(globalErrorHandling)

export default app
