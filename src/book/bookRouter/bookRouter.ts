import express from 'express'
import { createBook } from '../bookController/bookController'
import multer from 'multer'
import path from 'node:path'

const bookRouter = express.Router()

const uploads = multer({
    dest: path.resolve(__dirname, '../../../public/data/uploads'),
    limits: { fileSize: 30 * 1024 * 1024 },
})

bookRouter.post(
    '/',
    uploads.fields([
        {
            name: 'coverImage',
            maxCount: 1,
        },
        {
            name: 'file',
            maxCount: 1,
        },
    ]),
    createBook
)

export default bookRouter
