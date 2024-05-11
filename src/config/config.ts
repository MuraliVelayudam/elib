import { config as configuration } from 'dotenv'

configuration()

const _config = {
    port: process.env.PORT,
    mongoDB: process.env.MONGO_DB_URL,
    env: process.env.NODE_ENV,
    secretKey: process.env.JWT_SECRETKEY,
    // Cloudinary
    cloudName: process.env.CLOUD_NAME,
    cloudApiKey: process.env.CLOUD_API_KEY,
    cloudSecreteKy: process.env.CLOUD_API_SECRET,
}

export const config = Object.freeze(_config)
