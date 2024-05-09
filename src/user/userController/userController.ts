import { Request, Response, NextFunction } from 'express'
import User from '../userModel/userModel'
import createHttpError from 'http-errors'
import bcrypt from 'bcrypt'
import { config } from '../../config/config'
import { sign } from 'jsonwebtoken'
import { UserInterface } from '../userType'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        const error = createHttpError(400, 'Required All Field')
        next(error)
    }

    try {
        const user = await User.findOne({ email })

        if (user) {
            const error = createHttpError(400, 'User Already Exists')
            next(error)
        }
    } catch (err) {
        return next(createHttpError(500, 'Error in getting User'))
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let newUser: UserInterface

    try {
        newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        })
    } catch (err) {
        return next(createHttpError(500, 'Error Occurred While Create a New User'))
    }

    const token = sign({ sub: newUser._id }, config.secretKey as string, { expiresIn: '1d', algorithm: 'HS256' })

    res.status(201).json({ accessToken: token })
}

export { createUser }
