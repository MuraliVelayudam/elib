import express from 'express'
import { createBook } from '../bookController/bookController'
import multer from 'multer'
import path from 'node:path'
import authorization from '../../middlewares/authorization'

const bookRouter = express.Router()

const uploads = multer({
    dest: path.resolve(__dirname, '../../../public/data/uploads'),
    limits: { fileSize: 30 * 1024 * 1024 },
})

bookRouter.post(
    '/',
    authorization,
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
