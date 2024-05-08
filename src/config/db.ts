import mongoose from 'mongoose'
import { config } from './config'

const connectDb = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log(`Successfully connected to Database`)
        })

        await mongoose.connect(config.mongoDB as string)

        mongoose.connection.on('connected', (error) => {
            console.log(`Failed to connected to Database`, error)
        })
    } catch (err) {
        console.log(`Failed to connected to Database ff`, err)
        process.exit(1)
    }
}

export default connectDb
