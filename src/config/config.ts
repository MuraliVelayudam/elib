import { config as configuration } from 'dotenv'

configuration()

const _config = {
    port: process.env.PORT,
    mongoDB: process.env.MONGO_DB_URL,
    env: process.env.NODE_ENV,
    secretKey: process.env.JWT_SECRETKEY,
}

export const config = Object.freeze(_config)
