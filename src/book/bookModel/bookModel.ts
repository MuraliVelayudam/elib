import mongoose from 'mongoose'
import { BookInterface } from '../bookType'

const bookSchema = new mongoose.Schema<BookInterface>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        coverImage: {
            type: String,
            required: true,
        },
        file: {
            type: String,
            required: true,
        },
        genre: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

const Book = mongoose.model<BookInterface>('Book', bookSchema)

export default Book
