import { Request, Response, NextFunction } from 'express'
import { config } from '../../config/config'
import { sign } from 'jsonwebtoken'
import { UserInterface } from '../userType'
import User from '../userModel/userModel'
import createHttpError from 'http-errors'
import bcrypt from 'bcrypt'

// User Register

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body

    // Checking All Required Fields
    if (!name || !email || !password) {
        const error = createHttpError(400, 'Required All Field')
        next(error)
    }

    // Checking User Exists or Not
    try {
        const user = await User.findOne({ email })

        if (user) {
            const error = createHttpError(400, 'User Already Exists')
            next(error)
        }
    } catch (err) {
        return next(createHttpError(500, 'Error in getting User'))
    }

    // Hashed Password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Creating New User
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

    // Creating Token

    try {
        const token = sign({ sub: newUser._id }, config.secretKey as string, {
            expiresIn: '1d',
            algorithm: 'HS256',
        })
        res.status(201).json({ accessToken: token })
    } catch (err) {
        return next(createHttpError(500, 'Error occurred Sign in JWT Token'))
    }
}

// User Login

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    if (!email || !password) {
        const errors = createHttpError(400, 'Required All Fields')
        return next(errors)
    }

    const user = await User.findOne({ email })

    try {
        if (!user) {
            const errors = createHttpError(404, 'User Not Exists')
            next(errors)
        }
    } catch (err) {
        return next(createHttpError(400, 'Error Occurred While Getting User'))
    }

    const isMatched = user ? await bcrypt.compare(password, user.password) : null

    if (!isMatched) {
        const errors = createHttpError(400, 'Email or Password Wrong')
        return next(errors)
    }

    try {
        const token = sign({ sub: user?._id }, config.secretKey as string, { expiresIn: '1d', algorithm: 'HS256' })

        res.status(200).json({ accessToken: token })
    } catch (err) {
        return next(createHttpError(400, 'Error Occurred While Sign in  Token'))
    }
}

export { createUser, userLogin }
