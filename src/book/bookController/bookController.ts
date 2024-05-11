import { Request, Response, NextFunction, raw } from 'express'
import cloudinary from '../../config/cloudinary'
import path from 'node:path'
import createHttpError from 'http-errors'
import Book from '../bookModel/bookModel'
import fs from 'node:fs'

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, genre } = req.body

    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] }

        // Image Cloudinary

        const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1)
        const imageFileName = files.coverImage[0].filename
        const imageFilepath = path.resolve(__dirname, '../../../public/data/uploads', imageFileName)

        const imageUpload = await cloudinary.uploader.upload(imageFilepath, {
            filename_override: imageFileName,
            folder: 'Book-Covers',
            format: coverImageMimeType,
        })

        // FileUpload

        const bookMimeType = files.file[0].mimetype.split('/').at(-1)
        const bookFileName = files.file[0].filename
        const booFilePath = path.resolve(__dirname, '../../../public/data/uploads', bookFileName)

        const bookUpload = await cloudinary.uploader.upload(booFilePath, {
            resource_type: 'raw',
            filename_override: bookFileName,
            folder: 'Book-Pdfs',
            format: bookMimeType,
        })

        const newBook = await Book.create({
            title,
            genre,
            coverImage: imageUpload.secure_url,
            file: bookUpload.secure_url,
            author: '663e708374f4b815d197bd32',
        })

        try {
            await fs.promises.unlink(imageFilepath)
            await fs.promises.unlink(booFilePath)
        } catch (err) {
            return next(createHttpError(500, 'Error Occurred While Deleting Temp Files'))
        }

        res.status(201).json({ id: newBook._id })
    } catch (err) {
        console.log(err)
        return next(createHttpError(500, 'Error Occurred while Uploading Files'))
    }
}

export { createBook }
