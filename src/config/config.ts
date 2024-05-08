import { config as configuration } from 'dotenv'

configuration()

const _config = {
    port: process.env.PORT,
    mongoDB: process.env.MONGO_DB_URL,
}

export const config = Object.freeze(_config)
