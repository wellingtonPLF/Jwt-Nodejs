import express from "express"
import { PrismaUserRepository } from "../Repositories/RepositoryAdapters/PrismaUserRepository"
import { UserService } from "../Services/UserService"

const userRoute = express.Router()
const userRepository = new PrismaUserRepository()
const userService = new UserService(userRepository)

userRoute.get('/usuarios', async (req, res) => {
    try {
        const users = await userService.findAll()
        return res.status(201).json({data: users})
    }
    catch (e) {
        return res.status(500).send({"error": 'error'})
    }
})

userRoute.get('/usuarios/:id', async (req, res) => {
    try {
        const userId = req.params.id;        
        const user = await userService.findById(parseInt(userId));
        return res.status(201).json({data: user})
    }
    catch (e) {
        return res.status(500).send({"error": 'error'})
    }
})

userRoute.post('/usuarios', async (req, res) => {
    const { nickName, bornDate } = req.body
    
    try {        
        await userService.insert({
            nickName,
            bornDate
        })

        return res.status(201).send()    
    } 
    catch (e){
        return res.status(500).send({"error": 'error'})
    }
})

userRoute.put('/usuarios', async (req, res) => {
    const { id, nickName, bornDate } = req.body
    
    try {
        await userService.update({
            id,
            nickName,
            bornDate
        })

        return res.status(201).send()    
    } 
    catch (e){
        return res.status(500).send({"error": 'error'})
    }
})

userRoute.delete('/usuarios/:id', async (req, res) => {
    try {
        const userId = req.params.id;        
        await userService.delete(parseInt(userId));
        return res.status(201).send()
    }
    catch (e) {
        return res.status(500).send({"error": 'error'})
    }
})

export default userRoute;