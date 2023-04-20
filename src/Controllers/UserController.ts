import express from "express"
import { PrismaUserRepository } from "../Repositories/RepositoryAdapters/PrismaUserRepository"
import { UserService } from "../Services/UserService"
import { UserRequest } from "../Interfaces/UserRepository"

const userRoute = express.Router()
const userService = new UserService()

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
        const user = await userService.getAuthenticatedUser(req);
        return res.status(201).json({data: user})
    }
    catch (e) {
        return res.status(500).send({"error": 'error'})
    }
})

userRoute.post('/usuarios', async (req, res) => {
    const user: UserRequest = req.body;
    
    try {        
        await userService.insert(user)
        return res.status(201).send()  
    } 
    catch (e){
        return res.status(500).send({"error": 'error'})
    }
})

userRoute.put('/usuarios', async (req, res) => {
    const user: UserRequest = req.body;
    
    try {
        const result = await userService.update(user, req)
        return res.status(201).json({data: result})    
    } 
    catch (e){
        return res.status(500).send({"error": 'error'})
    }
})

userRoute.delete('/usuarios/:id', async (req, res) => {
    try {
        const userId = req.params.id;        
        await userService.delete(parseInt(userId), req, res);
        return res.status(201).send()
    }
    catch (e) {
        return res.status(500).send({"error": 'error'})
    }
})

export default userRoute;