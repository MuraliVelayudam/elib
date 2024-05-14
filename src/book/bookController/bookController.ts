import { Request, Response, NextFunction, raw } from 'express'
import cloudinary from '../../config/cloudinary'
import path from 'node:path'
import createHttpError from 'http-errors'
import Book from '../bookModel/bookModel'
import fs from 'node:fs'
import { AuthInterface } from '../../middlewares/authorization'

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, genre } = req.body

    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] }
        const _req = req as AuthInterface

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
            author: _req.userId,
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
// Book Update

const bookUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const { title, genre } = req.body
    const bookId = req.params.bookId
    const _req = req as AuthInterface

    const book = await Book.findById(bookId)

    if (!book) {
        const errors = createHttpError(401, 'Book Not Found')
        return next(errors)
    }

    if (book.author.toString() !== _req.userId) {
        const errors = createHttpError(403, 'Not Authorized')
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] }

    // Image Upload

    let updateCoverImage = ''
    if (files.coverImage) {
        const updateCoverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1)
        const updateCoverImageFileName = files.coverImage[0].filename
        const updateCoverImageFilePath = path.resolve(
            __dirname,
            '../../../public/data/uploads',
            updateCoverImageFileName
        )

        updateCoverImage = updateCoverImageFileName
        const updateCoverImageUploads = await cloudinary.uploader.upload(updateCoverImageFilePath, {
            filename_override: updateCoverImageFileName,
            folder: 'Book-Covers',
            format: updateCoverImageMimeType,
        })
        updateCoverImage = updateCoverImageUploads.secure_url
        await fs.promises.unlink(updateCoverImageFilePath)
    }

    let updateFilePdf = ''
    if (files.file) {
        const updateFilePdfMimetype = files.file[0].mimetype.split('/').at(-1)
        const updateFilePdfFileName = files.file[0].filename
        const updateFilePdfFilePath = path.resolve(__dirname, '../../../public/data/uploads', updateFilePdfFileName)

        updateFilePdf = updateFilePdfFileName
        const updateFilePdfUpload = await cloudinary.uploader.upload(updateFilePdfFilePath, {
            resource_type: 'raw',
            filename_override: updateFilePdfFileName,
            folder: 'Book-Pdfs',
            format: updateFilePdfMimetype,
        })

        updateFilePdf = updateFilePdfUpload.secure_url
        await fs.promises.unlink(updateFilePdfFilePath)
    }

    const updateBook = await Book.findByIdAndUpdate(
        { _id: bookId },
        {
            title: title,
            genre: genre,
            coverImage: updateCoverImage ? updateCoverImage : book.coverImage,
            file: updateFilePdf ? updateFilePdf : book.file,
        },
        { new: true }
    )

    res.status(200).json(updateBook)
}

const getAllBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await Book.find()
        res.status(200).json({ books })
    } catch (err) {
        return next(createHttpError(500, 'Error Occurred While Getting Books'))
    }
}

const getBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.bookId

        const book = await Book.findById({ _id: bookId })

        if (!book) {
            const errors = createHttpError(500, 'Book Not Found')
            return next(errors)
        }

        res.status(200).json({ book })
    } catch (err) {
        return next(createHttpError(400, 'Error Occurred While Getting Book'))
    }
}

export { createBook, bookUpdate, getAllBook, getBook }
