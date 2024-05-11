import { Request, Response, NextFunction } from 'express'
import createHttpError from 'http-errors'
import { verify } from 'jsonwebtoken'
import { config } from '../config/config'

export interface AuthInterface extends Request {
    userId: string
}

const authorization = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')

    if (!token) {
        return next(createHttpError(401, 'Invalid Authorization'))
    }

    try {
        const parsedToken = token.split(' ')[1]
        const decode = verify(parsedToken, config.secretKey as string)
        const _req = req as AuthInterface
        _req.userId = decode.sub as string

        next()
    } catch (err) {
        return next(createHttpError(401, 'Token Expired'))
    }
}

export default authorization
