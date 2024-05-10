import express from 'express'
import { createBook } from '../bookController/bookController'

const bookRouter = express.Router()

bookRouter.post('/', createBook)

export default bookRouter
