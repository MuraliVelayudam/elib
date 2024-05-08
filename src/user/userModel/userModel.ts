import mongoose from 'mongoose'
import { UserInterface } from '../userType'

const userSchema = new mongoose.Schema<UserInterface>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
)

const User = mongoose.model<UserInterface>('User', userSchema)

export default User
