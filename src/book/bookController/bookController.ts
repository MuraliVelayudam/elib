import { Request, Response, NextFunction, raw } from 'express'
import cloudinary from '../../config/cloudinary'
import path from 'node:path'
import createHttpError from 'http-errors'

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] }

        const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1)
        const fileName = files.coverImage[0].filename
        const filepath = path.resolve(__dirname, '../../../public/data/uploads', fileName)

        // Image Cloudinary

        const imageUpload = await cloudinary.uploader.upload(filepath, {
            filename_override: fileName,
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
    } catch (err) {
        console.log(err)
        return next(createHttpError(500, 'Error Occurred while Uploading Files'))
    }

    res.status(201).json({})
}

export { createBook }
