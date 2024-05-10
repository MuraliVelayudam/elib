import { UserInterface } from '../user/userType'

export interface BookInterface {
    _id: string
    title: string
    author: UserInterface
    genre: string
    coverImage: string
    file: string
    createdAt: Date
    updatedAt: Date
}
